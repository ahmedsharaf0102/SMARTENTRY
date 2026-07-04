-- ═══════════════════════════════════════════════════════════
-- SmartEntry Migration 004: Articles & Admin Role
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- ── 1. Add role column to profiles ─────────────────────────
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
CHECK (role IN ('user', 'admin'));

-- ── 2. Create articles table ───────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,                          -- Short excerpt for cards/SEO
  content TEXT NOT NULL,                 -- HTML from rich text editor
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('crypto', 'stocks', 'economy', 'analysis', 'general')),
  image_url TEXT,                        -- Cover image URL
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);

-- ── 4. Row Level Security ──────────────────────────────────
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read published articles (public)
CREATE POLICY "Published articles are public"
  ON articles FOR SELECT
  USING (is_published = true);

-- Admins can read ALL articles (including drafts)
CREATE POLICY "Admins can read all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can insert articles
CREATE POLICY "Admins can create articles"
  ON articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update articles
CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ── 5. Auto-update updated_at on changes ───────────────────
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_articles_updated_at();

-- ═══════════════════════════════════════════════════════════
-- AFTER RUNNING THIS MIGRATION:
-- Set yourself as admin:
--   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ═══════════════════════════════════════════════════════════
