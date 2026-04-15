/**
 * errorHandler.js — Global Express error-handling middleware
 *
 * Must be registered LAST in app.js (after all routes) with four parameters
 * so Express recognises it as an error handler.
 *
 * Handles:
 *  - Joi validation errors (422 Unprocessable Entity)
 *  - PostgreSQL errors (mapped to meaningful HTTP codes)
 *  - Generic operational errors with a statusCode property
 *  - Unexpected errors (500 Internal Server Error, stack hidden in prod)
 */

'use strict';

const logger = require('../utils/logger');

// PostgreSQL error codes we want to surface as specific HTTP responses
const PG_ERROR_MAP = {
  '23505': { status: 409, message: 'A record with this value already exists.', code: 'DUPLICATE_ENTRY' },
  '23503': { status: 409, message: 'Referenced record does not exist.', code: 'FOREIGN_KEY_VIOLATION' },
  '23502': { status: 422, message: 'A required field is missing.', code: 'NOT_NULL_VIOLATION' },
  '22P02': { status: 400, message: 'Invalid data format.', code: 'INVALID_FORMAT' },
  '42P01': { status: 500, message: 'Database table not found.', code: 'TABLE_NOT_FOUND' },
};

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next  - Must be declared even if unused
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Log every error with request context for debugging
  logger.error('[errorHandler]', {
    message: err.message,
    code: err.code,
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip,
  });

  // ── Joi validation error ─────────────────────────────────────────────────
  if (err.isJoi || err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      data: null,
      message: err.details
        ? err.details.map((d) => d.message).join('; ')
        : err.message,
      code: 'VALIDATION_ERROR',
    });
  }

  // ── PostgreSQL error ─────────────────────────────────────────────────────
  if (err.code && PG_ERROR_MAP[err.code]) {
    const mapped = PG_ERROR_MAP[err.code];
    return res.status(mapped.status).json({
      success: false,
      data: null,
      message: mapped.message,
      code: mapped.code,
    });
  }

  // ── Operational error with explicit statusCode ───────────────────────────
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      code: err.errorCode || 'ERROR',
    });
  }

  // ── Fallback: unexpected / programming error ─────────────────────────────
  const isProduction = process.env.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    data: null,
    message: isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
    code: 'INTERNAL_ERROR',
    // Expose stack trace in development only
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

/**
 * Creates an operational error with an HTTP status code.
 * Throw this from route handlers to trigger the error handler.
 *
 * @param {string} message
 * @param {number} statusCode
 * @param {string} errorCode
 * @returns {Error}
 *
 * @example
 *   throw createError('Club Card not found', 404, 'CARD_NOT_FOUND');
 */
function createError(message, statusCode = 400, errorCode = 'ERROR') {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.errorCode = errorCode;
  return err;
}

module.exports = { errorHandler, createError };
