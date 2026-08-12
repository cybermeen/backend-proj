const express = require('express');
const router = express.Router();

const productService = require('../services/productService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const authenticateToken = require('../utils/authMiddleware');

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.status(HTTP_STATUS.OK).json(products);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductFetchFailedMessage() });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(HTTP_STATUS.OK).json(product);
  } catch (err) {
    if (err.code === 'PRODUCT_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductFetchFailedMessage() });
  }
}

async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(HTTP_STATUS.CREATED).json(product);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductCreationFailedMessage() });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.updateProductById(id, req.body);
    res.status(HTTP_STATUS.OK).json(product);
  } catch (err) {
    if (err.code === 'PRODUCT_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductProcessingFailedMessage() });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.deleteProductById(id);
    res.status(HTTP_STATUS.OK).json(product);
  } catch (err) {
    if (err.code === 'PRODUCT_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductProcessingFailedMessage() });
  }
}

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;