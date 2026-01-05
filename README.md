# Portfolio Website

A modern, feature-rich portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL.

🌐 **Live Demo**: [legolasan.in](https://legolasan.in)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (Google & GitHub OAuth)
- **AI**: OpenAI GPT-4o-mini
- **Animations**: Framer Motion
- **Email**: EmailJS
- **Deployment**: PM2, Nginx, Let's Encrypt SSL

## Features

### 🎨 Core Features
- Responsive design with beautiful UI
- Dark/Light mode toggle with system preference detection
- Smooth animations and transitions
- SEO optimized

### 🤖 AI-Powered Chatbot
- Floating chat widget (bottom-right corner)
- Powered by OpenAI GPT-4o-mini
- Answers questions about professional background, skills, and projects
- Conversation history saved to database
- Admin dashboard to view all chat conversations

### 📝 Blog System
- Full-featured blog with admin panel
- Rich text editor (Quill)
- Categories and tags
- Comment system with moderation
- Search functionality
- Draft/Published status

### 📊 Analytics Dashboard
- Custom lightweight analytics (no external services)
- Page view tracking
- Visitor insights (browser, device, location)
- Top pages and referrers

### 📅 Integrations
- **Calendly**: Book meetings directly from the website
- **GitHub Stats**: Display repositories, stars, and activity
- **EmailJS**: Functional contact form that sends emails

### 🔐 Authentication & Admin
- OAuth login with Google and GitHub
- Role-based access (admin/user)
- Protected admin routes
- First user automatically becomes admin

## Sections

| Section | Description |
|---------|-------------|
| **Hero** | Eye-catching landing with social links |
| **About** | Professional summary with profile image |
| **Projects** | Portfolio showcase with live demos and GitHub links |
| **Skills** | Categorized skills with progress indicators |
| **Experience** | Work history timeline |
| **Education** | Academic background |
| **GitHub Stats** | Live GitHub profile and repository data |
| **Booking** | Calendly integration for scheduling |
| **Blog** | Latest blog posts |
| **Contact** | Contact form with EmailJS integration |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Legolasan/my-portfolio.git
cd my-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenAI (for AI Chatbot)
OPENAI_API_KEY="sk-your-openai-api-key"

# EmailJS (for Contact Form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your-service-id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your-template-id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your-public-key"
```

## Admin Dashboard

Access the admin panel at `/blogs/admin` after logging in with an admin account.

### Admin Features
- **Dashboard**: Overview and quick stats
- **Posts**: Create, edit, and manage blog posts
- **Categories & Tags**: Organize blog content
- **Comments**: Moderate user comments
- **Analytics**: View site traffic and insights
- **Chat Logs**: View all AI chatbot conversations

## Customization

### Content
Edit `src/lib/data.ts` to customize:
- Personal information
- Projects
- Work experience
- Education
- Skills

### Styling
- Colors and theme: `tailwind.config.js`
- Global styles: `src/app/globals.css`

### Images
Place images in `public/images/`:
- `profile.jpeg` - Profile photo
- `project1.jpg` to `project4.jpg` - Project thumbnails

## Deployment

### Using Deploy Script

```bash
# Deploy to VPS
./deploy/deploy.sh
```

The script handles:
- Building the project
- Syncing files to server
- Running database migrations
- Configuring Nginx
- Setting up SSL certificates
- Starting with PM2

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## Project Structure

```
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── images/             # Static images
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── blogs/          # Blog pages
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   ├── context/            # React contexts
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── data.ts         # Static content
│   │   └── db.ts           # Prisma client
│   └── middleware.ts       # Route protection
├── deploy/
│   └── deploy.sh           # Deployment script
└── nginx/                  # Nginx configurations
```

## License

MIT

## Author

**Arun Sundararajan**
- Website: [legolasan.in](https://legolasan.in)
- GitHub: [@Legolasan](https://github.com/Legolasan)
- LinkedIn: [arunsunderraj](https://linkedin.com/in/arunsunderraj)
