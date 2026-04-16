/**
 * migrate.js — Database migration and seed runner
 *
 * Usage (via npm scripts in package.json):
 *
 *   npm run migrate         → Apply all pending migration files
 *   npm run migrate:rollback → Drop all tables (DEV ONLY — destructive!)
 *   npm run seed            → Run all seed files
 *   npm run setup           → migrate + seed (first-time setup)
 *
 * Strategy (Phase 1):
 *   Simple sequential SQL file execution — no migration framework.
 *   Files are discovered from the migrations/ and seeds/ directories,
 *   sorted alphabetically (001_, 002_, etc. prefix guarantees order).
 *   Applied migrations are tracked in a _migrations table so files are
 *   never re-run.
 *
 *   For Phase 2, consider migrating to a proper migration tool (e.g. Flyway,
 *   node-pg-migrate, or Knex migrations) for rollback support and team-scale
 *   collaboration.
 */

'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Build pool directly here (without going through src/config/database.js) so
// the migration runner can be invoked standalone without needing all app deps.
const connString = process.env.DATABASE_URL || process.env.DB_URL;
const pool = new Pool(
  connString
    ? { connectionString: connString, ssl: connString.includes('neon.tech') ? { rejectUnauthorized: false } : false }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const SEEDS_DIR = path.join(__dirname, 'seeds');

// ── Helpers ───────────────────────────────────────────────────────────────

async function query(sql, params) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

/** Ensures the _migrations tracking table exists */
async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          SERIAL       PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

/** Returns the set of already-applied migration filenames */
async function getAppliedMigrations() {
  const result = await query('SELECT filename FROM _migrations ORDER BY id');
  return new Set(result.rows.map((r) => r.filename));
}

/** Marks a migration as applied */
async function recordMigration(filename) {
  await query('INSERT INTO _migrations (filename) VALUES ($1)', [filename]);
}

/** Reads all .sql files from a directory, sorted by filename */
function getSqlFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

/** Reads and executes a SQL file as a single transaction */
async function runSqlFile(filePath, label) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(`  ✓ ${label}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`  ✗ ${label} — ${err.message}`);
    throw err;
  } finally {
    client.release();
  }
}

// ── Commands ──────────────────────────────────────────────────────────────

/** Apply all pending migration files */
async function migrate() {
  console.log('\n[migrate] Running migrations...');
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = getSqlFiles(MIGRATIONS_DIR);
  let count = 0;

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  – ${file} (already applied)`);
      continue;
    }
    await runSqlFile(path.join(MIGRATIONS_DIR, file), file);
    await recordMigration(file);
    count++;
  }

  if (count === 0) {
    console.log('  No new migrations to apply.');
  } else {
    console.log(`\n[migrate] ${count} migration(s) applied successfully.\n`);
  }
}

/**
 * Drop all known tables — DEVELOPMENT ONLY.
 * Guards against accidental use in production.
 */
async function rollback() {
  if (process.env.NODE_ENV === 'production') {
    console.error('[migrate:rollback] REFUSED — cannot rollback in production.');
    process.exit(1);
  }

  console.log('\n[migrate:rollback] Dropping all tables...');
  await query(`
    DROP TABLE IF EXISTS
      analytics_events,
      notifications,
      gift_vouchers,
      coupon_redemptions,
      coupons,
      coupon_batches,
      promotions,
      loyalty_config,
      points_ledger,
      club_cards,
      users,
      stores,
      _migrations
    CASCADE
  `);
  console.log('[migrate:rollback] All tables dropped.\n');
}

/** Run all seed files (idempotent — seeds use ON CONFLICT DO NOTHING) */
async function seed() {
  console.log('\n[seed] Running seed files...');
  const files = getSqlFiles(SEEDS_DIR);

  if (files.length === 0) {
    console.log('  No seed files found.');
    return;
  }

  for (const file of files) {
    await runSqlFile(path.join(SEEDS_DIR, file), file);
  }

  console.log(`\n[seed] ${files.length} seed file(s) applied successfully.\n`);
}

// ── Entry point ───────────────────────────────────────────────────────────

const command = process.argv[2];

const commands = { migrate, rollback, seed };

if (!commands[command]) {
  console.error(`Usage: node src/db/migrate.js <migrate|rollback|seed>`);
  process.exit(1);
}

commands[command]()
  .then(() => pool.end())
  .catch((err) => {
    console.error('\n[migrate] Fatal error:', err.message);
    pool.end().finally(() => process.exit(1));
  });
