/**
 * env.js — Environment variable validation and export
 *
 * Validates required env vars at startup so the app fails fast.
 * Supports both DATABASE_URL (Vercel/Neon/Supabase) and individual DB_* vars.
 * Redis and JWT are Phase 2 features — optional in Phase 1.
 */

'use strict';

// Database: either a full connection URL or individual host/port/etc.
const hasDbUrl = !!(process.env.DATABASE_URL || process.env.DB_URL);
const hasIndividualDb = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
  .every((k) => !!process.env[k]);

if (!hasDbUrl && !hasIndividualDb) {
  console.error(
    '[env] Database not configured. Provide DATABASE_URL or set DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD.'
  );
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),

  // PostgreSQL — supports both connection string and individual vars
  db: {
    connectionString: process.env.DATABASE_URL || process.env.DB_URL || undefined,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMs: parseInt(process.env.DB_POOL_IDLE_TIMEOUT_MS || '30000', 10),
    connectionTimeoutMs: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT_MS || '5000', 10),
  },

  // Redis — Phase 2 (optional)
  redis: {
    url: process.env.REDIS_URL || undefined,
    host: process.env.REDIS_HOST || undefined,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    enabled: !!(process.env.REDIS_URL || process.env.REDIS_HOST),
  },

  // JWT — Phase 2 (optional, no auth in Phase 1)
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS — comma-separated list of allowed origins in production
  cors: {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

module.exports = env;
