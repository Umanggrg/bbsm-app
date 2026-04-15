'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/products.controller');

const router = Router();

router.get('/', ctrl.listProducts);
router.get('/categories', ctrl.listCategories);
router.get('/:id', ctrl.getProduct);

module.exports = router;
