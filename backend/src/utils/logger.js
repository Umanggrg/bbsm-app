/**
 * logger.js — Winston logger
 *
 * Outputs structured JSON logs in production (for log aggregators like
 * CloudWatch) and human-readable colorized logs in development.
 *
 * Daily rotating file transport writes to logs/combined-YYYY-MM-DD.log
 * and logs/error-YYYY-MM-DD.log. The logs/ directory is git-ignored.
 */

'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, errors, json, colorize, printf } = format;

const isProduction = process.env.NODE_ENV === 'production';

// Human-readable format for development console output
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}] ${stack || message}${metaStr}`;
  })
);

// Structured JSON format for production / file transports
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: prodFormat,
  defaultMeta: { service: 'bbsm-backend' },
  transports: [
    // Console transport — pretty in dev, JSON in prod
    new transports.Console({
      format: isProduction ? prodFormat : devFormat,
    }),

    // Rotating file — all levels
    new transports.DailyRotateFile({
      filename: path.join('logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),

    // Rotating file — errors only
    new transports.DailyRotateFile({
      level: 'error',
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  ],
  // Prevent winston from crashing the process on uncaught exceptions
  exitOnError: false,
});

module.exports = logger;
