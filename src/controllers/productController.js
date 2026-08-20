const express = require('express');
const router = express.Router();

const productService = require('../services/productService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const { successResponse } = require('../utils/responseFormatter');
const authenticateToken = require('../utils/authMiddleware');
const upload = require('../utils/uploadMiddleware');
const fs = require('fs');
const path = require('path');

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
    const { category_id, name, price, status, stock, minimum_stock } = req.body;

    if (!category_id || !name || !price) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getProductValidationMessage() });
    }

    // Path stored in the DB 
    const imagePath = req.file ? `/products/${req.file.filename}` : null;

    const newProduct = await productService.createProduct({
      category_id, name, price, status, stock, minimum_stock, image: imagePath,
    });

    res.status(HTTP_STATUS.CREATED).json(successResponse('Product created successfully', newProduct));
  } catch (err) {
    if (err.code === '23503') return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidCategoryMessage() });
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductCreationFailedMessage() });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { category_id, name, price, status, stock, minimum_stock } = req.body;

    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: errorMessages.getProductNotFoundMessage() });
    }

    let imagePath = existingProduct.image;
    if (req.file) {
      imagePath = `/products/${req.file.filename}`;

      if (existingProduct.image) {
        const oldFilePath = path.join(__dirname, '../../public', existingProduct.image);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Failed to delete old product image:', err);
        });
      }
    }

    const updatedProduct = await productService.updateProduct(id, {
      category_id, name, price, status, stock, minimum_stock, image: imagePath,
    });

    res.status(HTTP_STATUS.OK).json(successResponse('Product updated successfully', updatedProduct));
  } catch (err) {
    if (err.code === '23503') return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidCategoryMessage() });
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getProductUpdateFailedMessage() });
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
router.post('/', authenticateToken, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;