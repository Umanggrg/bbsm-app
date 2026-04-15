/**
 * stores.js — Store routes
 *
 * All routes are public (no auth middleware).
 *
 *   GET /api/v1/stores
 *   GET /api/v1/stores/provinces
 *   GET /api/v1/stores/:id
 *
 * Note: /provinces must be registered BEFORE /:id so Express does not
 * treat the literal string "provinces" as a UUID param.
 */

'use strict';

const { Router } = require('express');
const {
  listStores,
  listProvinces,
  getStore,
} = require('../controllers/stores.controller');

const router = Router();

router.get('/', listStores);
router.get('/provinces', listProvinces);
router.get('/:id', getStore);

module.exports = router;
