#!/bin/bash

# Umami Analytics Setup Script
# Run this on the VPS to set up Umami

set -e

echo "🔧 Setting up Umami Analytics..."

# Create directory for Umami
UMAMI_DIR="/opt/umami"
mkdir -p $UMAMI_DIR

# Copy docker-compose file
cat > $UMAMI_DIR/docker-compose.yml << 'EOF'
version: '3'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://umami:umami_secure_password@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: ${UMAMI_APP_SECRET:-replace_with_random_string}
    depends_on:
      db:
        condition: service_healthy
    restart: always

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami_secure_password
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U umami"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  umami-db-data:
EOF

# Generate random app secret
APP_SECRET=$(openssl rand -hex 32)
echo "UMAMI_APP_SECRET=$APP_SECRET" > $UMAMI_DIR/.env

echo "📦 Pulling Umami Docker images..."
cd $UMAMI_DIR
docker compose pull

echo "🚀 Starting Umami..."
docker compose up -d

# Wait for Umami to be ready
echo "⏳ Waiting for Umami to start..."
sleep 30

# Check if Umami is running
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Umami is running on port 3001"
else
    echo "⚠️ Umami may still be starting. Check logs with: docker compose -f $UMAMI_DIR/docker-compose.yml logs"
fi

# Add Umami location to Nginx config
echo "📝 Updating Nginx configuration..."

# Check if umami location already exists in the config
if ! grep -q "location /analytics/" /etc/nginx/sites-available/portfolio.conf; then
    # Add before the last closing brace of the main server block
    sed -i '/^}$/i\
    # Umami Analytics\
    location /analytics/ {\
        proxy_pass http://localhost:3001/;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }\
\
    location /api/send {\
        proxy_pass http://localhost:3001/api/send;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }' /etc/nginx/sites-available/portfolio.conf
fi

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo ""
echo "✅ Umami Analytics setup complete!"
echo ""
echo "📊 Access your analytics dashboard:"
echo "   URL: https://legolasan.in/analytics"
echo ""
echo "🔐 Default login credentials:"
echo "   Username: admin"
echo "   Password: umami"
echo ""
echo "⚠️  IMPORTANT: Change the default password immediately after first login!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to https://legolasan.in/analytics"
echo "   2. Log in with admin/umami"
echo "   3. Change your password in Settings > Profile"
echo "   4. Add your website in Settings > Websites"
echo "   5. Copy the tracking code and add it to your site"

