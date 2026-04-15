/**
 * requestLogger.js — HTTP request logging middleware (Morgan → Winston)
 *
 * In development: concise, colorized output per request.
 * In production:  structured JSON piped into Winston so all logs (HTTP +
 *                 application) go through the same pipeline.
 */

'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

// Pipe Morgan's output into the Winston stream
const winstonStream = {
  write: (message) => logger.http(message.trim()),
};

const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream: winstonStream }
);

module.exports = { requestLogger };
