-- ═══════════════════════════════════════════════════════════
-- Migration 005: Smart Economic Calendar
-- ═══════════════════════════════════════════════════════════

-- Table for storing processed economic events with smart analysis
CREATE TABLE IF NOT EXISTS economic_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    country TEXT DEFAULT 'US',
    actual TEXT,
    forecast TEXT,
    previous TEXT,
    target_market TEXT NOT NULL DEFAULT 'All Markets',
    affected_assets TEXT NOT NULL DEFAULT '',
    impact_analysis TEXT,
    importance TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (importance IN ('HIGH', 'MEDIUM', 'LOW')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Prevent duplicate events (same name + time)
    UNIQUE (event_name, event_time)
);

-- Index for fast queries by date and importance
CREATE INDEX IF NOT EXISTS idx_eco_cal_time ON economic_calendar (event_time DESC);
CREATE INDEX IF NOT EXISTS idx_eco_cal_importance ON economic_calendar (importance);
CREATE INDEX IF NOT EXISTS idx_eco_cal_market ON economic_calendar (target_market);

-- RLS: Public read, service-role write
ALTER TABLE economic_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read economic calendar"
    ON economic_calendar FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage economic calendar"
    ON economic_calendar FOR ALL
    USING (true)
    WITH CHECK (true);
