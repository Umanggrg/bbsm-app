'use strict';

require('dotenv').config();

let app;
try {
  app = require('../src/app');
} catch (e) {
  console.error('[api/index] App initialization error:', e.message, e.stack);
  app = (req, res) => res.status(500).json({ error: 'Init failed', detail: e.message });
}

module.exports = app;
