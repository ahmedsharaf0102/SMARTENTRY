-- ═══════════════════════════════════════════════════
-- Migration 002: Update action check constraint
-- Adds STRONG_BUY and AVOID to allowed signal actions
-- Run in: Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Drop the old constraint
ALTER TABLE signals DROP CONSTRAINT IF EXISTS signals_action_check;

-- Add the new constraint with all 5 action types
ALTER TABLE signals ADD CONSTRAINT signals_action_check
  CHECK (action IN ('STRONG_BUY', 'BUY', 'WATCH', 'WAIT', 'AVOID'));
