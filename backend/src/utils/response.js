/**
 * response.js — Standardised API response helpers
 *
 * Every endpoint uses these helpers to guarantee the envelope shape:
 *
 *   Success: { success: true,  data: any,  message: string }
 *   Error:   { success: false, data: null, message: string, code: string }
 *
 * Using helpers (instead of ad-hoc res.json calls) means the shape can never
 * drift across different developers or modules.
 */

'use strict';

/**
 * Send a successful response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {any}    options.data     - Response payload
 * @param {string} options.message  - Human-readable description
 * @param {number} [options.status] - HTTP status code (default 200)
 */
function sendSuccess(res, { data = null, message = 'OK', status = 200 } = {}) {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
}

/**
 * Send a created (201) response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {any}    options.data
 * @param {string} options.message
 */
function sendCreated(res, { data = null, message = 'Created' } = {}) {
  return sendSuccess(res, { data, message, status: 201 });
}

/**
 * Send an error response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string} options.message   - Human-readable error description
 * @param {string} options.code      - Machine-readable error code (ALL_CAPS)
 * @param {number} [options.status]  - HTTP status code (default 400)
 */
function sendError(
  res,
  { message = 'An error occurred', code = 'ERROR', status = 400 } = {}
) {
  return res.status(status).json({
    success: false,
    data: null,
    message,
    code,
  });
}

/**
 * Convenience wrappers for common HTTP errors.
 */
const errors = {
  badRequest: (res, message = 'Bad request', code = 'BAD_REQUEST') =>
    sendError(res, { message, code, status: 400 }),

  unauthorized: (res, message = 'Unauthorized', code = 'UNAUTHORIZED') =>
    sendError(res, { message, code, status: 401 }),

  forbidden: (res, message = 'Forbidden', code = 'FORBIDDEN') =>
    sendError(res, { message, code, status: 403 }),

  notFound: (res, message = 'Not found', code = 'NOT_FOUND') =>
    sendError(res, { message, code, status: 404 }),

  conflict: (res, message = 'Conflict', code = 'CONFLICT') =>
    sendError(res, { message, code, status: 409 }),

  unprocessable: (
    res,
    message = 'Unprocessable entity',
    code = 'UNPROCESSABLE'
  ) => sendError(res, { message, code, status: 422 }),

  tooManyRequests: (
    res,
    message = 'Too many requests. Please try again later.',
    code = 'RATE_LIMITED'
  ) => sendError(res, { message, code, status: 429 }),

  internal: (res, message = 'Internal server error', code = 'INTERNAL_ERROR') =>
    sendError(res, { message, code, status: 500 }),
};

module.exports = { sendSuccess, sendCreated, sendError, errors };
