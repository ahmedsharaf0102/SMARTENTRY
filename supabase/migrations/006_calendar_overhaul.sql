-- ═══════════════════════════════════════════════════════════
-- Migration 006: Economic Calendar Overhaul — Schema Upgrade
-- Adds global support, status tracking, and professional data fields
-- ═══════════════════════════════════════════════════════════

-- New columns for global coverage & professional data
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS previous_revised TEXT;
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS data_period TEXT;
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS official_source_name TEXT;
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS official_source_url TEXT;
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Released', 'Revised'));
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE economic_calendar ADD COLUMN IF NOT EXISTS unit TEXT;

-- Index for currency filtering (global events)
CREATE INDEX IF NOT EXISTS idx_eco_cal_currency ON economic_calendar (currency);
CREATE INDEX IF NOT EXISTS idx_eco_cal_status ON economic_calendar (status);
