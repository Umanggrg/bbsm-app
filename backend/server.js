'use strict';

require('dotenv').config();

const app = require('./src/app');
const env = require('./src/config/env');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const logger = require('./src/utils/logger');

let server;

async function start() {
  try {
    logger.info(`[server] Starting BBSM Backend in '${env.NODE_ENV}' mode...`);

    await connectDatabase();

    // Redis is Phase 2 — only connect if configured
    if (env.redis.enabled) {
      const { connectRedis } = require('./src/config/redis');
      await connectRedis();
    } else {
      logger.info('[server] Redis not configured — skipping (Phase 2 feature)');
    }

    server = app.listen(env.PORT, () => {
      logger.info(`[server] HTTP server listening on port ${env.PORT}`);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('[server] Unhandled promise rejection', { reason });
    });

    process.on('uncaughtException', (err) => {
      logger.error('[server] Uncaught exception — shutting down', { message: err.message });
      shutdown(1);
    });
  } catch (err) {
    logger.error('[server] Failed to start', { message: err.message });
    process.exit(1);
  }
}

async function shutdown(code = 0) {
  logger.info('[server] Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      try {
        await disconnectDatabase();
        if (env.redis.enabled) {
          const { disconnectRedis } = require('./src/config/redis');
          await disconnectRedis();
        }
        process.exit(code);
      } catch {
        process.exit(1);
      }
    });
    setTimeout(() => process.exit(code), 10_000);
  } else {
    process.exit(code);
  }
}

process.on('SIGTERM', () => shutdown(0));
process.on('SIGINT', () => shutdown(0));

start();
