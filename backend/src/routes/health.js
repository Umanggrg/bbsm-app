/**
 * health.js — Health check routes
 *
 * GET /health        — Basic liveness probe (always 200 if Express is up)
 * GET /health/ready  — Readiness probe (checks DB + Redis connectivity)
 *
 * These endpoints are called by:
 *  - AWS ELB / ALB target group health checks
 *  - Container orchestrators (ECS health check)
 *  - Monitoring tools (UptimeRobot, etc.)
 *
 * They are intentionally NOT behind auth middleware.
 */

'use strict';

const { Router } = require('express');
const { pool } = require('../config/database');
const { redis } = require('../config/redis');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const router = Router();

// ── GET /health ────────────────────────────────────────────────────────────
// Minimal liveness check — just confirms the Node process and Express are up.
router.get('/', (req, res) => {
  sendSuccess(res, {
    data: {
      status: 'ok',
      service: 'bbsm-backend',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
    },
    message: 'Service is running',
  });
});

// ── GET /health/ready ──────────────────────────────────────────────────────
// Readiness probe — verifies that both PostgreSQL and Redis are reachable.
// Returns 503 if either dependency is unhealthy.
router.get('/ready', async (req, res) => {
  const checks = { postgres: 'unknown', redis: 'unknown' };
  let healthy = true;

  // Check PostgreSQL
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    checks.postgres = 'ok';
  } catch (err) {
    checks.postgres = 'error';
    healthy = false;
    logger.error('[health] PostgreSQL check failed', { error: err.message });
  }

  // Check Redis
  try {
    const pong = await redis.ping();
    checks.redis = pong === 'PONG' ? 'ok' : 'error';
    if (checks.redis !== 'ok') healthy = false;
  } catch (err) {
    checks.redis = 'error';
    healthy = false;
    logger.error('[health] Redis check failed', { error: err.message });
  }

  if (healthy) {
    return sendSuccess(res, {
      data: { status: 'ready', checks, timestamp: new Date().toISOString() },
      message: 'All dependencies healthy',
    });
  }

  return sendError(res, {
    message: 'One or more dependencies are unhealthy',
    code: 'DEPENDENCIES_UNHEALTHY',
    status: 503,
  });
});

module.exports = router;
