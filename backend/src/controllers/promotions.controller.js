/**
 * promotions.controller.js
 *
 * Handles all promotions request logic.
 * All endpoints are public — no authentication required.
 *
 * A promotion is "active" when:
 *   - is_published = TRUE
 *   - NOW() is between start_date and end_date
 *
 * Endpoints:
 *   GET /api/v1/promotions            → list all currently active promotions
 *   GET /api/v1/promotions/categories → distinct list of categories (for filter UI)
 *   GET /api/v1/promotions/:id        → single promotion detail
 */

'use strict';

const { pool } = require('../config/database');
const { sendSuccess } = require('../utils/response');
const { createError } = require('../middleware/errorHandler');

// ── GET /api/v1/promotions ────────────────────────────────────────────────
// Returns all currently active (published + within date range) promotions.
// Optional query params:
//   ?category=grocery    → filter by category slug (case-insensitive)
//   ?limit=20            → max results (default 20, max 100)
//   ?offset=0            → pagination offset
async function listPromotions(req, res, next) {
  try {
    const { category } = req.query;

    // Clamp limit between 1 and 100
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '20', 10), 1),
      100
    );
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);

    const conditions = [
      'is_published = TRUE',
      'start_date <= NOW()',
      'end_date >= NOW()',
    ];
    const params = [];

    if (category) {
      params.push(category.toLowerCase().trim());
      conditions.push(`LOWER(category) = $${params.length}`);
    }

    const whereClause = conditions.join(' AND ');

    // Count total matching rows (for pagination metadata)
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM promotions WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Fetch the page
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT
         id,
         title,
         title_ne,
         description,
         description_ne,
         image_url,
         category,
         tier_target,
         start_date,
         end_date,
         is_published,
         created_at,
         updated_at
       FROM promotions
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return sendSuccess(res, {
      data: {
        promotions: result.rows,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + result.rowCount < total,
        },
      },
      message: `${result.rowCount} promotion(s) found`,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/promotions/categories ─────────────────────────────────────
// Returns distinct non-null categories from currently active promotions.
// Used by the mobile app Offers screen to build the category filter chips.
async function listCategories(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category
       FROM promotions
       WHERE
         is_published = TRUE
         AND start_date <= NOW()
         AND end_date >= NOW()
         AND category IS NOT NULL
       ORDER BY category ASC`
    );

    return sendSuccess(res, {
      data: { categories: result.rows.map((r) => r.category) },
      message: `${result.rowCount} category/categories found`,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/promotions/:id ────────────────────────────────────────────
// Returns a single promotion by UUID.
// Returns 404 if the promotion does not exist or is not currently active.
async function getPromotion(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         id,
         title,
         title_ne,
         description,
         description_ne,
         image_url,
         category,
         tier_target,
         start_date,
         end_date,
         is_published,
         created_at,
         updated_at
       FROM promotions
       WHERE
         id = $1
         AND is_published = TRUE
         AND start_date <= NOW()
         AND end_date >= NOW()`,
      [id]
    );

    if (result.rowCount === 0) {
      throw createError('Promotion not found', 404, 'PROMOTION_NOT_FOUND');
    }

    return sendSuccess(res, {
      data: { promotion: result.rows[0] },
      message: 'Promotion retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPromotions, listCategories, getPromotion };
