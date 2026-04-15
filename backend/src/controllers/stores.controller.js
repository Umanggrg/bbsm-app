/**
 * stores.controller.js
 *
 * Handles all store-related request logic.
 * All endpoints are public — no authentication required.
 *
 * Endpoints:
 *   GET /api/v1/stores           → list all active stores
 *   GET /api/v1/stores/provinces → distinct list of provinces (for filter UI)
 *   GET /api/v1/stores/:id       → single store detail
 */

'use strict';

const { pool } = require('../config/database');
const { sendSuccess } = require('../utils/response');
const { createError } = require('../middleware/errorHandler');

// ── GET /api/v1/stores ────────────────────────────────────────────────────
// Returns all active stores.
// Optional query params:
//   ?province=Bagmati   → filter by province name (case-insensitive)
//   ?search=pokhara     → search by store name or address (case-insensitive)
async function listStores(req, res, next) {
  try {
    const { province, search } = req.query;

    // Build query dynamically based on which filters are provided
    const conditions = ['is_active = TRUE'];
    const params = [];

    if (province) {
      params.push(province);
      conditions.push(`LOWER(province) = LOWER($${params.length})`);
    }

    if (search) {
      params.push(`%${search.trim()}%`);
      conditions.push(
        `(LOWER(name) LIKE LOWER($${params.length}) OR LOWER(address) LIKE LOWER($${params.length}))`
      );
    }

    const whereClause = conditions.join(' AND ');

    const result = await pool.query(
      `SELECT
         id,
         name,
         address,
         province,
         phone,
         hours,
         lat,
         lng,
         manager_name,
         is_active,
         created_at,
         updated_at
       FROM stores
       WHERE ${whereClause}
       ORDER BY
         -- Kathmandu Valley (Bagmati) stores first, then alphabetical by province + name
         CASE WHEN province = 'Bagmati' THEN 0 ELSE 1 END,
         province ASC,
         name ASC`,
      params
    );

    return sendSuccess(res, {
      data: {
        stores: result.rows,
        total: result.rowCount,
      },
      message: `${result.rowCount} store(s) found`,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/stores/provinces ──────────────────────────────────────────
// Returns a distinct list of provinces that have at least one active store.
// Used by the mobile app to populate the province filter dropdown.
async function listProvinces(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT province
       FROM stores
       WHERE is_active = TRUE
       ORDER BY province ASC`
    );

    return sendSuccess(res, {
      data: { provinces: result.rows.map((r) => r.province) },
      message: `${result.rowCount} province(s) found`,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/stores/:id ────────────────────────────────────────────────
// Returns a single store by its UUID.
async function getStore(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         id,
         name,
         address,
         province,
         phone,
         hours,
         lat,
         lng,
         manager_name,
         is_active,
         created_at,
         updated_at
       FROM stores
       WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (result.rowCount === 0) {
      throw createError('Store not found', 404, 'STORE_NOT_FOUND');
    }

    return sendSuccess(res, {
      data: { store: result.rows[0] },
      message: 'Store retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStores, listProvinces, getStore };
