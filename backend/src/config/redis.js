/**
 * redis.js — Redis client (ioredis)
 *
 * Used for:
 *  - OTP storage (key: otp:{phone}, TTL: OTP_EXPIRY_SECONDS)
 *  - Rate limiting backing store
 *  - Session / token caching
 *  - General short-lived key-value cache
 *
 * ioredis automatically reconnects on disconnect, so no manual retry logic
 * is needed. Errors are logged but do not crash the process.
 */

'use strict';

const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

// Build ioredis config. If REDIS_URL is provided it takes precedence.
const redisConfig = env.redis.url
  ? env.redis.url
  : {
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password || undefined,
      // Retry strategy: exponential back-off capped at 30 s, max 10 attempts.
      retryStrategy(times) {
        if (times > 10) {
          logger.error('[redis] Max reconnection attempts reached. Giving up.');
          return null; // stop retrying
        }
        const delay = Math.min(times * 200, 30000);
        logger.warn(`[redis] Reconnecting in ${delay}ms (attempt ${times})`);
        return delay;
      },
      enableReadyCheck: true,
      lazyConnect: false,
    };

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  logger.info('[redis] Connected to Redis');
});

redis.on('ready', () => {
  logger.info('[redis] Redis client ready');
});

redis.on('error', (err) => {
  logger.error('[redis] Redis error', { error: err.message });
});

redis.on('close', () => {
  logger.warn('[redis] Redis connection closed');
});

/**
 * Verifies Redis connectivity at startup.
 * Called once from server.js before the HTTP server starts.
 *
 * @returns {Promise<void>}
 */
async function connectRedis() {
  await redis.ping();
  logger.info('[redis] Redis PING successful');
}

/**
 * Gracefully closes the Redis connection.
 * Called during process shutdown in server.js.
 *
 * @returns {Promise<void>}
 */
async function disconnectRedis() {
  await redis.quit();
  logger.info('[redis] Redis connection closed');
}

module.exports = { redis, connectRedis, disconnectRedis };
