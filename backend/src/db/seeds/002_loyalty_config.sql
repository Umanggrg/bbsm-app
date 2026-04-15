-- =============================================================================
-- Seed: 002_loyalty_config.sql
-- Description: Default loyalty program configuration
--
-- Phase 1 defaults (all values are configurable via admin dashboard):
--   - 1 point earned per NRs 100 spent  (points_per_nrs = 100)
--   - Silver tier:   0 – 9,999 points
--   - Gold tier:     10,000 – 49,999 points
--   - Platinum tier: 50,000+ points
-- =============================================================================

INSERT INTO loyalty_config (
    points_per_nrs,
    silver_threshold,
    gold_threshold,
    platinum_threshold,
    updated_at
)
VALUES (
    100,      -- 1 point per NRs 100 spent
    0,        -- Silver starts at 0
    10000,    -- Gold starts at 10,000 points
    50000,    -- Platinum starts at 50,000 points
    NOW()
)
-- If a row already exists (re-running seed), leave it untouched to avoid
-- overwriting live admin config changes.
ON CONFLICT DO NOTHING;
