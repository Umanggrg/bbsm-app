/**
 * app.js — Express application factory
 *
 * Wires together:
 *  - Security middleware (Helmet, CORS)
 *  - Request parsing
 *  - Rate limiting
 *  - Request logging
 *  - Route registration
 *  - 404 handler
 *  - Global error handler (must be last)
 *
 * The app is exported and consumed by server.js, which is responsible for
 * starting the HTTP server and connecting to dependencies. Keeping them
 * separate makes the app easier to test.
 */

'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env');
const { requestLogger } = require('./middleware/requestLogger');
const { defaultLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { errors } = require('./utils/response');

// ── Route modules ──────────────────────────────────────────────────────────
const healthRouter    = require('./routes/health');
const storesRouter    = require('./routes/stores');
const promotionsRouter = require('./routes/promotions');
const productsRouter  = require('./routes/products');
const adminRouter     = require('./routes/admin/index');

const app = express();

// ── Trust proxy ────────────────────────────────────────────────────────────
// Required in production behind AWS ALB / CloudFront so that
// req.ip returns the real client IP (used by rate limiters).
if (env.isProduction) {
  app.set('trust proxy', 1);
}

// ── Security headers (Helmet) ──────────────────────────────────────────────
app.use(
  helmet({
    // Content-Security-Policy is left to the admin frontend to configure.
    // The API only serves JSON — no HTML, no scripts.
    contentSecurityPolicy: false,
  })
);

// ── CORS ───────────────────────────────────────────────────────────────────
// In development, allow all origins for easy local testing.
// In production, restrict to the explicitly listed origins.
const corsOptions = {
  origin: env.isProduction
    ? (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, Postman in prod)
        if (!origin || env.cors.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
      }
    : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  credentials: true,
};

app.use(cors(corsOptions));

// ── Request logging ────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Rate limiting ──────────────────────────────────────────────────────────
// Applied globally — individual route groups can apply stricter limiters.
app.use(defaultLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────
// All versioned routes live under /api/v1
const API_PREFIX = '/api/v1';

// Health checks (no auth, no version prefix — stable path for infra tools)
app.use('/health', healthRouter);

// Public routes — no authentication required
app.use(`${API_PREFIX}/stores`, storesRouter);
app.use(`${API_PREFIX}/promotions`, promotionsRouter);
app.use(`${API_PREFIX}/products`, productsRouter);

// Admin routes — internal use only (auth middleware added later)
app.use(`${API_PREFIX}/admin`, adminRouter);
// app.use(`${API_PREFIX}/admin`,         adminLimiter, authenticate, adminRouter);
// app.use(`${API_PREFIX}/admin`,         adminLimiter, authenticate, requireAdmin, adminRouter);

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  errors.notFound(res, `Route ${req.method} ${req.path} not found`, 'ROUTE_NOT_FOUND');
});

// ── Global error handler ───────────────────────────────────────────────────
// Must be registered last and must have exactly 4 parameters.
app.use(errorHandler);

module.exports = app;
