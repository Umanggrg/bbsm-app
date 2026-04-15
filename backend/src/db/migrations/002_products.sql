-- Migration 002: Products catalog
-- Run: npm run migrate

CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku           VARCHAR(100) UNIQUE,
  name          VARCHAR(255) NOT NULL,
  name_ne       VARCHAR(255),                    -- Nepali name (optional)
  description   TEXT,
  category      VARCHAR(100),
  subcategory   VARCHAR(100),
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit          VARCHAR(50) NOT NULL DEFAULT 'piece',  -- piece, kg, litre, pack
  image_url     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sku       ON products (sku);
