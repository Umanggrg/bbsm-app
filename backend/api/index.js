'use strict';

// Load env vars before anything else
require('dotenv').config();

// Export the Express app for Vercel serverless
module.exports = require('../src/app');
