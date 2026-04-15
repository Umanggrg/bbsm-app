'use strict';

const { pool } = require('../../config/database');
const { sendSuccess, sendCreated, errors } = require('../../utils/response');

// ── List products ─────────────────────────────────────────────────────────

async function listProducts(req, res, next) {
  try {
    const { category, search, is_active, limit = 100, offset = 0 } = req.query;
    const params = [];
    const conditions = [];

    if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
    if (is_active !== undefined) { params.push(is_active === 'true'); conditions.push(`is_active = $${params.length}`); }
    if (search) { params.push(`%${search}%`); conditions.push(`(name ILIKE $${params.length} OR sku ILIKE $${params.length})`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(Number(limit), Number(offset));

    const result = await pool.query(
      `SELECT * FROM products ${where} ORDER BY category, name LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products ${where}`,
      params.slice(0, params.length - 2)
    );

    sendSuccess(res, {
      data: {
        products: result.rows,
        total: parseInt(countResult.rows[0].count),
      },
    });
  } catch (err) { next(err); }
}

// ── Create product ────────────────────────────────────────────────────────

async function createProduct(req, res, next) {
  try {
    const { name, name_ne, sku, description, category, subcategory, price, unit, image_url, is_active, is_featured } = req.body;
    if (!name) return errors.badRequest(res, 'name is required');
    if (price === undefined || price === null) return errors.badRequest(res, 'price is required');

    const result = await pool.query(
      `INSERT INTO products (name, name_ne, sku, description, category, subcategory, price, unit, image_url, is_active, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, name_ne || null, sku || null, description || null, category || null, subcategory || null,
       parseFloat(price), unit || 'piece', image_url || null,
       is_active !== false, is_featured === true]
    );
    sendCreated(res, { data: { product: result.rows[0] }, message: 'Product created' });
  } catch (err) { next(err); }
}

// ── Update product ────────────────────────────────────────────────────────

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, name_ne, sku, description, category, subcategory, price, unit, image_url, is_active, is_featured } = req.body;

    const result = await pool.query(
      `UPDATE products SET
        name=$1, name_ne=$2, sku=$3, description=$4, category=$5, subcategory=$6,
        price=$7, unit=$8, image_url=$9, is_active=$10, is_featured=$11
       WHERE id=$12 RETURNING *`,
      [name, name_ne || null, sku || null, description || null, category || null, subcategory || null,
       parseFloat(price), unit || 'piece', image_url || null,
       is_active !== false, is_featured === true, id]
    );

    if (!result.rows.length) return errors.notFound(res, 'Product not found');
    sendSuccess(res, { data: { product: result.rows[0] } });
  } catch (err) { next(err); }
}

// ── Delete product ────────────────────────────────────────────────────────

async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return errors.notFound(res, 'Product not found');
    sendSuccess(res, { data: { deleted: req.params.id } });
  } catch (err) { next(err); }
}

// ── CSV bulk upload ───────────────────────────────────────────────────────
// Expected CSV columns (header required):
//   name, sku, category, subcategory, price, unit, description, image_url, is_active, is_featured
//
// Upserts on SKU when provided, otherwise inserts new rows.

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));

  return lines.slice(1).map((line, i) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    values.push(current.trim());

    if (values.length !== headers.length) throw new Error(`Row ${i + 2}: column count mismatch`);

    const row = {};
    headers.forEach((h, j) => { row[h] = values[j]; });
    return row;
  });
}

async function csvUpload(req, res, next) {
  try {
    if (!req.file && !req.body.csv) {
      return errors.badRequest(res, 'Provide a CSV file upload or raw csv in body');
    }

    const text = req.file ? req.file.buffer.toString('utf8') : req.body.csv;
    let rows;
    try { rows = parseCSV(text); }
    catch (e) { return errors.badRequest(res, e.message); }

    const results = { inserted: 0, updated: 0, errors: [] };

    for (const [i, row] of rows.entries()) {
      if (!row.name) { results.errors.push(`Row ${i + 2}: name is required`); continue; }
      const price = parseFloat(row.price);
      if (isNaN(price)) { results.errors.push(`Row ${i + 2}: invalid price "${row.price}"`); continue; }

      try {
        if (row.sku) {
          const r = await pool.query(
            `INSERT INTO products (name, name_ne, sku, description, category, subcategory, price, unit, image_url, is_active, is_featured)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             ON CONFLICT (sku) DO UPDATE SET
               name=$1, name_ne=$2, description=$4, category=$5, subcategory=$6,
               price=$7, unit=$8, image_url=$9, is_active=$10, is_featured=$11
             RETURNING (xmax = 0) AS inserted`,
            [row.name, row.name_ne || null, row.sku, row.description || null,
             row.category || null, row.subcategory || null, price,
             row.unit || 'piece', row.image_url || null,
             row.is_active !== 'false', row.is_featured === 'true']
          );
          r.rows[0].inserted ? results.inserted++ : results.updated++;
        } else {
          await pool.query(
            `INSERT INTO products (name, name_ne, description, category, subcategory, price, unit, image_url, is_active, is_featured)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [row.name, row.name_ne || null, row.description || null,
             row.category || null, row.subcategory || null, price,
             row.unit || 'piece', row.image_url || null,
             row.is_active !== 'false', row.is_featured === 'true']
          );
          results.inserted++;
        }
      } catch (e) {
        results.errors.push(`Row ${i + 2}: ${e.message}`);
      }
    }

    sendSuccess(res, {
      data: results,
      message: `CSV processed: ${results.inserted} inserted, ${results.updated} updated, ${results.errors.length} errors`,
    });
  } catch (err) { next(err); }
}

// ── Categories ────────────────────────────────────────────────────────────

async function listCategories(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND is_active = true ORDER BY category`
    );
    sendSuccess(res, { data: { categories: result.rows.map((r) => r.category) } });
  } catch (err) { next(err); }
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct, csvUpload, listCategories };
