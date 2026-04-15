'use strict';

const { Router } = require('express');
const multer = require('multer');

const promotionsCtrl = require('../../controllers/admin/promotions.admin.controller');
const storesCtrl     = require('../../controllers/admin/stores.admin.controller');
const productsCtrl   = require('../../controllers/admin/products.admin.controller');

const router = Router();

// Multer: store CSV in memory (no disk writes needed)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── Promotions ─────────────────────────────────────────────────────────────
router.get('/promotions',              promotionsCtrl.listPromotions);
router.post('/promotions',             promotionsCtrl.createPromotion);
router.put('/promotions/:id',          promotionsCtrl.updatePromotion);
router.patch('/promotions/:id/publish', promotionsCtrl.togglePublish);
router.delete('/promotions/:id',       promotionsCtrl.deletePromotion);

// ── Stores ─────────────────────────────────────────────────────────────────
router.get('/stores',     storesCtrl.listStores);
router.put('/stores/:id', storesCtrl.updateStore);

// ── Products ───────────────────────────────────────────────────────────────
router.get('/products',              productsCtrl.listProducts);
router.get('/products/categories',   productsCtrl.listCategories);
router.post('/products',             productsCtrl.createProduct);
router.post('/products/csv',         upload.single('file'), productsCtrl.csvUpload);
router.put('/products/:id',          productsCtrl.updateProduct);
router.delete('/products/:id',       productsCtrl.deleteProduct);

module.exports = router;
