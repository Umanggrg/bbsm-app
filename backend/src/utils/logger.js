'use strict';

const { createLogger, format, transports } = require('winston');

const { combine, timestamp, errors, json, colorize, printf } = format;

const isProduction = process.env.NODE_ENV === 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}] ${stack || message}${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: prodFormat,
  defaultMeta: { service: 'bbsm-backend' },
  transports: [
    // Console only — compatible with Vercel serverless and local dev
    new transports.Console({ format: isProduction ? prodFormat : devFormat }),
  ],
  exitOnError: false,
});

module.exports = logger;
