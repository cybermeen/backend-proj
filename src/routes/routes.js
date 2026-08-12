const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const purchaseController = require('../controllers/purchaseController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const reportsController = require('../controllers/reportsController');

router.use('/auth', authController);
router.use('/users', userController);
router.use('/reports', reportsController);

router.use('/purchases', purchaseController);
router.use('/products', productController);
router.use('/orders', orderController);

module.exports = router;