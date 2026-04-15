'use strict';

const { pool } = require('../../config/database');
const { sendSuccess, sendCreated } = require('../../utils/response');
const { createError } = require('../../middleware/errorHandler');

// GET /api/v1/admin/promotions — all promotions (including unpublished)
async function listPromotions(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT * FROM promotions ORDER BY created_at DESC`
    );
    return sendSuccess(res, {
      data: { promotions: result.rows, total: result.rowCount },
      message: `${result.rowCount} promotion(s)`,
    });
  } catch (err) { next(err); }
}

// POST /api/v1/admin/promotions — create
async function createPromotion(req, res, next) {
  try {
    const {
      title, title_ne, description, description_ne,
      image_url, category, tier_target,
      start_date, end_date, is_published,
    } = req.body;

    if (!title || !start_date || !end_date) {
      throw createError('title, start_date, and end_date are required', 400, 'VALIDATION_ERROR');
    }
    if (new Date(end_date) <= new Date(start_date)) {
      throw createError('end_date must be after start_date', 400, 'VALIDATION_ERROR');
    }

    const result = await pool.query(
      `INSERT INTO promotions
         (title, title_ne, description, description_ne, image_url,
          category, tier_target, start_date, end_date, is_published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [title, title_ne || null, description || null, description_ne || null,
       image_url || null, category || null, tier_target || null,
       start_date, end_date, is_published ?? false]
    );

    return sendCreated(res, {
      data: { promotion: result.rows[0] },
      message: 'Promotion created successfully',
    });
  } catch (err) { next(err); }
}

// PUT /api/v1/admin/promotions/:id — update
async function updatePromotion(req, res, next) {
  try {
    const { id } = req.params;
    const {
      title, title_ne, description, description_ne,
      image_url, category, tier_target,
      start_date, end_date, is_published,
    } = req.body;

    const result = await pool.query(
      `UPDATE promotions SET
         title=$1, title_ne=$2, description=$3, description_ne=$4,
         image_url=$5, category=$6, tier_target=$7,
         start_date=$8, end_date=$9, is_published=$10,
         updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [title, title_ne || null, description || null, description_ne || null,
       image_url || null, category || null, tier_target || null,
       start_date, end_date, is_published ?? false, id]
    );

    if (result.rowCount === 0) throw createError('Promotion not found', 404, 'NOT_FOUND');

    return sendSuccess(res, {
      data: { promotion: result.rows[0] },
      message: 'Promotion updated successfully',
    });
  } catch (err) { next(err); }
}

// PATCH /api/v1/admin/promotions/:id/publish — toggle publish
async function togglePublish(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE promotions SET is_published = NOT is_published, updated_at=NOW()
       WHERE id=$1 RETURNING id, title, is_published`,
      [id]
    );
    if (result.rowCount === 0) throw createError('Promotion not found', 404, 'NOT_FOUND');

    const promo = result.rows[0];
    return sendSuccess(res, {
      data: { promotion: promo },
      message: promo.is_published ? 'Promotion published' : 'Promotion unpublished',
    });
  } catch (err) { next(err); }
}

// DELETE /api/v1/admin/promotions/:id
async function deletePromotion(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM promotions WHERE id=$1 RETURNING id', [id]);
    if (result.rowCount === 0) throw createError('Promotion not found', 404, 'NOT_FOUND');

    return sendSuccess(res, { data: null, message: 'Promotion deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { listPromotions, createPromotion, updatePromotion, togglePublish, deletePromotion };
