'use strict';

const { pool } = require('../config/database');
const { sendSuccess, errors } = require('../utils/response');

// ── Public: list products ─────────────────────────────────────────────────

async function listProducts(req, res, next) {
  try {
    const { category, subcategory, search, featured, limit = 40, offset = 0 } = req.query;
    const params = [];
    const conditions = ['is_active = true'];

    if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
    if (subcategory) { params.push(subcategory); conditions.push(`subcategory = $${params.length}`); }
    if (featured === 'true') { conditions.push(`is_featured = true`); }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;
    params.push(Number(limit), Number(offset));

    const [rows, count] = await Promise.all([
      pool.query(
        `SELECT * FROM products ${where} ORDER BY is_featured DESC, category, name LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      ),
      pool.query(`SELECT COUNT(*) FROM products ${where}`, params.slice(0, params.length - 2)),
    ]);

    sendSuccess(res, {
      data: {
        products: rows.rows,
        pagination: { total: parseInt(count.rows[0].count), limit: Number(limit), offset: Number(offset) },
      },
    });
  } catch (err) { next(err); }
}

// ── Public: get one ───────────────────────────────────────────────────────

async function getProduct(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id=$1 AND is_active=true', [req.params.id]);
    if (!result.rows.length) return errors.notFound(res, 'Product not found');
    sendSuccess(res, { data: { product: result.rows[0] } });
  } catch (err) { next(err); }
}

// ── Public: categories ────────────────────────────────────────────────────

async function listCategories(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND is_active=true ORDER BY category`
    );
    sendSuccess(res, { data: { categories: result.rows.map((r) => r.category) } });
  } catch (err) { next(err); }
}

module.exports = { listProducts, getProduct, listCategories };
