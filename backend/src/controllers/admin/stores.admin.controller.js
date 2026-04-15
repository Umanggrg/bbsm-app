'use strict';

const { pool } = require('../../config/database');
const { sendSuccess } = require('../../utils/response');
const { createError } = require('../../middleware/errorHandler');

// GET /api/v1/admin/stores
async function listStores(req, res, next) {
  try {
    const result = await pool.query(`SELECT * FROM stores ORDER BY province, name`);
    return sendSuccess(res, {
      data: { stores: result.rows, total: result.rowCount },
      message: `${result.rowCount} store(s)`,
    });
  } catch (err) { next(err); }
}

// PUT /api/v1/admin/stores/:id
async function updateStore(req, res, next) {
  try {
    const { id } = req.params;
    const { name, address, province, phone, hours, lat, lng, manager_name, is_active } = req.body;

    const result = await pool.query(
      `UPDATE stores SET
         name=$1, address=$2, province=$3, phone=$4,
         hours=$5, lat=$6, lng=$7, manager_name=$8,
         is_active=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, address, province, phone || null, hours,
       lat, lng, manager_name || null, is_active ?? true, id]
    );

    if (result.rowCount === 0) throw createError('Store not found', 404, 'NOT_FOUND');

    return sendSuccess(res, {
      data: { store: result.rows[0] },
      message: 'Store updated successfully',
    });
  } catch (err) { next(err); }
}

module.exports = { listStores, updateStore };
