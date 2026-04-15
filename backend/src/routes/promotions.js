/**
 * promotions.js — Promotions routes
 *
 * All routes are public (no auth middleware).
 *
 *   GET /api/v1/promotions
 *   GET /api/v1/promotions/categories
 *   GET /api/v1/promotions/:id
 *
 * Note: /categories must be registered BEFORE /:id.
 */

'use strict';

const { Router } = require('express');
const {
  listPromotions,
  listCategories,
  getPromotion,
} = require('../controllers/promotions.controller');

const router = Router();

router.get('/', listPromotions);
router.get('/categories', listCategories);
router.get('/:id', getPromotion);

module.exports = router;
