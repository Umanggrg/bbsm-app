/**
 * database.js — PostgreSQL connection pool
 *
 * Uses the `pg` library with a connection pool. All queries across the app
 * import this pool and call pool.query() directly — no ORM in Phase 1 to
 * keep the stack simple and queries explicit.
 *
 * The pool automatically manages connections. Do NOT call pool.end() except
 * during graceful server shutdown (handled in server.js).
 */

'use strict';

const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

// Build pool config. If DB_URL is provided, pg parses it automatically;
// otherwise individual fields are used.
const poolConfig = env.db.connectionString
  ? {
      connectionString: env.db.connectionString,
      max: env.db.poolMax,
      idleTimeoutMillis: env.db.idleTimeoutMs,
      connectionTimeoutMillis: env.db.connectionTimeoutMs,
      // Enforce SSL in production (RDS, Supabase, etc.)
      ssl: env.isProduction ? { rejectUnauthorized: false } : false,
    }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password,
      max: env.db.poolMax,
      idleTimeoutMillis: env.db.idleTimeoutMs,
      connectionTimeoutMillis: env.db.connectionTimeoutMs,
      ssl: env.isProduction ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(poolConfig);

// Log when a new client is checked out from the pool (useful for debugging
// connection leaks in development).
pool.on('connect', () => {
  logger.debug('[db] New client connected to PostgreSQL pool');
});

pool.on('error', (err) => {
  logger.error('[db] Unexpected error on idle PostgreSQL client', {
    error: err.message,
  });
  // Do not exit — pg will handle reconnection. Log and continue.
});

/**
 * Verifies the database connection at startup.
 * Called once from server.js before the HTTP server starts listening.
 *
 * @returns {Promise<void>}
 */
async function connectDatabase() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() AS now');
    logger.info(
      `[db] PostgreSQL connected — server time: ${result.rows[0].now}`
    );
  } finally {
    // Always release the client back to the pool
    client.release();
  }
}

/**
 * Gracefully closes all pool connections.
 * Called during process shutdown in server.js.
 *
 * @returns {Promise<void>}
 */
async function disconnectDatabase() {
  await pool.end();
  logger.info('[db] PostgreSQL pool closed');
}

module.exports = { pool, connectDatabase, disconnectDatabase };
