-- Simple Analytics Tables
-- Note: Using cuid format to match Prisma schema's @default(cuid())
CREATE TABLE IF NOT EXISTS page_views (
    id TEXT PRIMARY KEY,
    page_path VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    user_agent TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    device VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_session ON page_views(session_id);

