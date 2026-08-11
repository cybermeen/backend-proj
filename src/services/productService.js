const productModel = require('../models/productModel');
const errorMessages = require('../utils/errorMessages');

async function getAllProducts() {
  return productModel.getAllProducts();
}

async function getProductById(id) {
  const product = await productModel.getProductById(id);
  if (!product) {
    const error = new Error(errorMessages.getProductNotFoundMessage());
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return product;
}

async function createProduct(payload) {
  return productModel.createProduct(payload);
}

async function updateProductById(id, payload) {
  const product = await productModel.updateProductById(id, payload);
  if (!product) {
    const error = new Error(errorMessages.getProductNotFoundMessage());
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return product;
}

async function deleteProductById(id) {
  const product = await productModel.deleteProductById(id);
  if (!product) {
    const error = new Error(errorMessages.getProductNotFoundMessage());
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return product;
}

async function increaseStock(productId, quantity) {
  const product = await productModel.increaseStock(productId, quantity);
  if (!product) {
    const error = new Error(errorMessages.getProductNotFoundMessage());
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return product;
}

async function decreaseStock(productId, quantity) {
  const product = await productModel.decreaseStock(productId, quantity);
  if (!product) {
    const error = new Error(errorMessages.getProductNotFoundMessage());
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }
  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  increaseStock,
  decreaseStock
};
