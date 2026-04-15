/**
 * rateLimiter.js — express-rate-limit configurations
 *
 * Different limits are applied to different route groups:
 *
 *  - defaultLimiter   : All routes — 100 req / 15 min per IP
 *  - authLimiter      : OTP send + verify — 10 req / 15 min per IP
 *                       (prevents SMS abuse and brute-force OTP guessing)
 *  - adminLimiter     : Admin dashboard routes — 300 req / 15 min per IP
 *
 * In production, set `trustProxy: true` in app.js so X-Forwarded-For is
 * respected (required behind AWS ALB / CloudFront).
 */

'use strict';

const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { errors } = require('../utils/response');

// Shared handler so the error shape matches our API envelope
const rateLimitHandler = (req, res) => {
  errors.tooManyRequests(res);
};

const defaultLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,   // 15 minutes
  max: env.rateLimit.max,              // 100 requests
  standardHeaders: true,               // Return RateLimit-* headers
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Strict limit for authentication endpoints to prevent OTP spam / brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  // Key by IP only (phone number keying happens inside the route handler)
  keyGenerator: (req) => req.ip,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

// Slightly more generous limit for the internal admin dashboard
const adminLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { defaultLimiter, authLimiter, adminLimiter };
