-- ═══════════════════════════════════════════════════
-- Migration 003: Gold support
-- Creates gold_macro table + adds XAUUSD to signals
-- Run in: Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Gold macro data (FRED economic indicators)
CREATE TABLE IF NOT EXISTS gold_macro (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  macro_score INTEGER DEFAULT 0,
  tech_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow RLS bypass for service role
ALTER TABLE gold_macro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on gold_macro"
  ON gold_macro FOR ALL
  USING (true)
  WITH CHECK (true);

-- Also update signals check constraint to include XAUUSD signal types
ALTER TABLE signals DROP CONSTRAINT IF EXISTS signals_signal_type_check;
-- (No constraint on signal_type — we allow any string)
