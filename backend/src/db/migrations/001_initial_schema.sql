-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Full Phase 1 database schema for the BBSM Official App
-- Created: 2026-04-12
-- Run with: npm run migrate
-- =============================================================================

-- Enable UUID generation (PostgreSQL built-in, available in PG 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. STORES
--    Physical BBSM store locations visible in the customer app's Store Finder.
--    28 stores across Nepal (13 Kathmandu Valley + 15 outside valley).
-- =============================================================================
CREATE TABLE IF NOT EXISTS stores (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(120) NOT NULL,
    address           TEXT         NOT NULL,
    province          VARCHAR(60)  NOT NULL,
    phone             VARCHAR(20),
    hours             VARCHAR(80)  NOT NULL DEFAULT '7:00 AM – 9:00 PM',
    lat               NUMERIC(10, 7) NOT NULL,
    lng               NUMERIC(10, 7) NOT NULL,
    manager_name      VARCHAR(80),
    is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stores_province ON stores(province);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON stores(is_active);

-- =============================================================================
-- 2. USERS
--    Customers who register via the mobile app using phone-number OTP.
--    email is optional (many Nepali users don't use email regularly).
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    phone             VARCHAR(15)  NOT NULL UNIQUE,   -- E.164 format: +977XXXXXXXXXX
    name              VARCHAR(100),
    email             VARCHAR(120) UNIQUE,
    preferred_store_id UUID        REFERENCES stores(id) ON DELETE SET NULL,
    language          VARCHAR(5)   NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ne')),
    firebase_uid      VARCHAR(128) UNIQUE,            -- Firebase Auth UID
    fcm_token         TEXT,                           -- Firebase Cloud Messaging device token
    status            VARCHAR(10)  NOT NULL DEFAULT 'active'
                                   CHECK (status IN ('active', 'suspended')),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_preferred_store ON users(preferred_store_id);

-- =============================================================================
-- 3. CLUB CARDS
--    One Club Card per user. Stores current tier and points balance.
--    Historical ledger lives in points_ledger (below).
--
--    Tier thresholds (configurable via admin → loyalty_config table):
--      Silver:   0 – 9,999 points
--      Gold:     10,000 – 49,999 points
--      Platinum: 50,000+ points
-- =============================================================================
CREATE TABLE IF NOT EXISTS club_cards (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    card_number     VARCHAR(20)  NOT NULL UNIQUE,   -- Physical card or auto-generated virtual number
    tier            VARCHAR(10)  NOT NULL DEFAULT 'silver'
                                 CHECK (tier IN ('silver', 'gold', 'platinum')),
    points_balance  INTEGER      NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_club_cards_user_id ON club_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_club_cards_card_number ON club_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_club_cards_tier ON club_cards(tier);

-- =============================================================================
-- 4. POINTS LEDGER
--    Immutable record of every points earn or burn event.
--    The running balance is maintained on club_cards.points_balance for fast
--    reads; this table is the source of truth for auditing and expiry.
--
--    type:
--      'earn' — points added (e.g., from a purchase)
--      'burn' — points deducted (e.g., redeeming a coupon)
--      'adjust' — manual correction by admin (requires reason)
--      'expire' — system expiry of earned points
--
--    expires_at:
--      Set 12 months from earned_at for 'earn' rows.
--      NULL for 'burn', 'adjust', and 'expire' rows.
--
--    transaction_ref:
--      External reference (POS transaction ID, coupon code, etc.).
--      NULL until ERP integration in Phase 2.
-- =============================================================================
CREATE TABLE IF NOT EXISTS points_ledger (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    club_card_id    UUID         NOT NULL REFERENCES club_cards(id) ON DELETE CASCADE,
    points          INTEGER      NOT NULL,  -- Positive for earn/adjust-up, negative for burn/expire/adjust-down
    type            VARCHAR(10)  NOT NULL
                                 CHECK (type IN ('earn', 'burn', 'adjust', 'expire')),
    reason          TEXT         NOT NULL,  -- Human-readable description (mandatory)
    transaction_ref VARCHAR(100),           -- POS/ERP reference (Phase 2)
    admin_id        UUID,                  -- Set when type = 'adjust' — links to admin user
    earned_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ            -- Only set for type = 'earn'
);

CREATE INDEX IF NOT EXISTS idx_points_ledger_club_card_id ON points_ledger(club_card_id);
CREATE INDEX IF NOT EXISTS idx_points_ledger_type ON points_ledger(type);
CREATE INDEX IF NOT EXISTS idx_points_ledger_expires_at ON points_ledger(expires_at)
    WHERE expires_at IS NOT NULL;   -- Partial index — only earned rows have expiry

-- =============================================================================
-- 5. LOYALTY CONFIG
--    Single-row table. Admin dashboard writes to this; the backend reads it
--    before every points calculation. Redis caches it with a short TTL.
--
--    Phase 1 defaults (inserted in seed):
--      points_per_nrs    = 100  → 1 point per NRs 100 spent
--      silver_threshold  = 0
--      gold_threshold    = 10000
--      platinum_threshold = 50000
-- =============================================================================
CREATE TABLE IF NOT EXISTS loyalty_config (
    id                  SERIAL       PRIMARY KEY,
    points_per_nrs      INTEGER      NOT NULL DEFAULT 100 CHECK (points_per_nrs > 0),
    silver_threshold    INTEGER      NOT NULL DEFAULT 0    CHECK (silver_threshold >= 0),
    gold_threshold      INTEGER      NOT NULL DEFAULT 10000 CHECK (gold_threshold > 0),
    platinum_threshold  INTEGER      NOT NULL DEFAULT 50000 CHECK (platinum_threshold > 0),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_by_admin_id UUID                               -- FK to admin_users added later
);

-- Enforce single-row constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_loyalty_config_single_row ON loyalty_config((TRUE));

-- =============================================================================
-- 6. PROMOTIONS
--    Banner / card promotions displayed in the app's Home and Offers screens.
--
--    tier_target:
--      NULL  → visible to all customers
--      'silver' / 'gold' / 'platinum' → visible only to that tier and above
-- =============================================================================
CREATE TABLE IF NOT EXISTS promotions (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(120) NOT NULL,
    title_ne        VARCHAR(120),                     -- Nepali translation (optional)
    description     TEXT,
    description_ne  TEXT,                             -- Nepali translation (optional)
    image_url       TEXT,                             -- S3 URL
    category        VARCHAR(40),                      -- e.g. 'grocery', 'electronics', 'fashion'
    tier_target     VARCHAR(10)
                    CHECK (tier_target IN ('silver', 'gold', 'platinum') OR tier_target IS NULL),
    start_date      TIMESTAMPTZ  NOT NULL,
    end_date        TIMESTAMPTZ  NOT NULL,
    is_published    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT promotions_date_order CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_promotions_is_published ON promotions(is_published);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_tier ON promotions(tier_target);

-- =============================================================================
-- 7. COUPON BATCHES
--    Groups of coupon codes created together with the same rules.
--    The admin creates a batch; individual coupon codes live in the
--    coupons table below.
-- =============================================================================
CREATE TABLE IF NOT EXISTS coupon_batches (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    prefix          VARCHAR(10)  NOT NULL,              -- e.g. 'DIWALI25'
    discount_type   VARCHAR(10)  NOT NULL
                    CHECK (discount_type IN ('flat', 'percent')),
    discount_value  NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    expiry          TIMESTAMPTZ  NOT NULL,
    usage_limit     INTEGER      NOT NULL DEFAULT 1,    -- Per-customer usage limit
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_batches_is_active ON coupon_batches(is_active);

-- =============================================================================
-- 8. COUPONS
--    Individual coupon codes belonging to a batch.
--    Each code is single-use per customer (enforced via coupon_redemptions).
-- =============================================================================
CREATE TABLE IF NOT EXISTS coupons (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id        UUID         NOT NULL REFERENCES coupon_batches(id) ON DELETE CASCADE,
    code            VARCHAR(30)  NOT NULL UNIQUE,
    used_count      INTEGER      NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_batch_id ON coupons(batch_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);

-- =============================================================================
-- 9. COUPON REDEMPTIONS
--    Tracks which user redeemed which coupon (enforces single-use per customer).
-- =============================================================================
CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id       UUID         NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    redeemed_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    store_id        UUID         REFERENCES stores(id) ON DELETE SET NULL,
    UNIQUE (coupon_id, user_id)  -- One redemption per coupon per user
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon_id ON coupon_redemptions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user_id ON coupon_redemptions(user_id);

-- =============================================================================
-- 10. GIFT VOUCHERS
--     Pre-loaded value vouchers issued to specific customers.
--     Redeemable at any of the 28 store locations (at POS — Phase 2 for in-app).
-- =============================================================================
CREATE TABLE IF NOT EXISTS gift_vouchers (
    id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    code                    VARCHAR(20)  NOT NULL UNIQUE,
    value                   NUMERIC(10, 2) NOT NULL CHECK (value > 0),
    issued_to_user_id       UUID         REFERENCES users(id) ON DELETE SET NULL,
    redeemed_at             TIMESTAMPTZ,
    redeemed_at_store_id    UUID         REFERENCES stores(id) ON DELETE SET NULL,
    expiry                  TIMESTAMPTZ  NOT NULL,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_vouchers_code ON gift_vouchers(code);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_issued_to ON gift_vouchers(issued_to_user_id);

-- =============================================================================
-- 11. NOTIFICATIONS
--     Push notification records (sent or scheduled).
--     Actual delivery is handled by Firebase Cloud Messaging (FCM).
--
--     target_type:
--       'all'    → every registered user with an FCM token
--       'tier'   → target_value = 'silver' | 'gold' | 'platinum'
--       'store'  → target_value = store UUID
--       'user'   → target_value = user phone number
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(120) NOT NULL,
    body            TEXT         NOT NULL,
    target_type     VARCHAR(10)  NOT NULL
                    CHECK (target_type IN ('all', 'tier', 'store', 'user')),
    target_value    TEXT,        -- Depends on target_type; NULL when target_type = 'all'
    image_url       TEXT,        -- Optional rich push image (S3 URL)
    scheduled_at    TIMESTAMPTZ,             -- NULL → sent immediately
    sent_at         TIMESTAMPTZ,             -- NULL → not yet sent
    sent_count      INTEGER      DEFAULT 0,
    open_count      INTEGER      DEFAULT 0,  -- Updated via FCM delivery receipt webhook
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_at ON notifications(scheduled_at)
    WHERE sent_at IS NULL;  -- Only unsent notifications need this index

-- =============================================================================
-- 12. ANALYTICS EVENTS
--     Lightweight event table for backend-originated analytics.
--     Firebase Analytics captures client-side events (screen views, taps).
--     This table captures server-side events (OTP sent, coupon redeemed, etc.)
--     that need to be queryable in the admin dashboard.
--
--     event_data is JSONB so each event type can carry its own shape without
--     requiring a schema change.
-- =============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         REFERENCES users(id) ON DELETE SET NULL,
    event_type      VARCHAR(60)  NOT NULL,    -- e.g. 'club_card_scanned', 'otp_sent'
    event_data      JSONB        NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Partition by created_at for long-term scalability (simple monthly index for Phase 1)
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_data ON analytics_events USING gin(event_data);

-- =============================================================================
-- TRIGGERS — updated_at auto-maintenance
--    A single trigger function updates the updated_at column on every UPDATE.
--    Applied to tables that have an updated_at column.
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'stores', 'users', 'club_cards', 'promotions'
    ]
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;
             CREATE TRIGGER trg_set_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
            tbl, tbl
        );
    END LOOP;
END;
$$;

-- =============================================================================
-- End of migration 001
-- =============================================================================
