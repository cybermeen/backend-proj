const pool = require('../config/db');
const productModel = require('../models/productModel');
const purchaseModel = require('../models/purchaseModel');
const errorMessages = require('../utils/errorMessages');

async function getAllPurchases() {
  return purchaseModel.getAllPurchases();
}

async function getPurchaseById(id) {
  const purchase = await purchaseModel.getPurchaseById(id);
  if (!purchase) {
    const error = new Error(errorMessages.getPurchaseNotFoundMessage());
    error.code = 'PURCHASE_NOT_FOUND';
    throw error;
  }
  return purchase;
}

async function createPurchase({ invoice_no, supplier_name, items }) {
  if (!invoice_no || !supplier_name || !Array.isArray(items) || items.length === 0) {
    const error = new Error(errorMessages.getPurchaseValidationMessage());
    error.code = 'INVALID_PURCHASE_PAYLOAD';
    throw error;
  }

  for (const item of items) {
    if (item.product_id == null || item.quantity == null ||
      item.quantity <= 0 || item.cost_price == null) {
      const error = new Error(errorMessages.getPurchaseValidationMessage());
      error.code = 'INVALID_PURCHASE_PAYLOAD';
      throw error;
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let grandTotal = 0;
    const preparedItems = [];

    for (const item of items) {
      const product = await productModel.getProductById(item.product_id, client);
      if (!product) {
        const error = new Error(`Product with id ${item.product_id} does not exist`);
        error.code = 'PRODUCT_NOT_FOUND';
        throw error;
      }

      const costPrice = Number(item.cost_price);
      const quantity = Number(item.quantity);

      if (!Number.isFinite(costPrice) || costPrice < 0 || !Number.isFinite(quantity) || quantity <= 0) {
        const error = new Error(errorMessages.getPurchaseValidationMessage());
        error.code = 'INVALID_PURCHASE_PAYLOAD';
        throw error;
      }

      const total = costPrice * quantity;
      grandTotal += total;

      preparedItems.push({
        product_id: product.id,
        product_name: product.name,
        cost_price: costPrice,
        quantity,
        total,
      });
    }

    const newPurchase = await purchaseModel.insertPurchase(
      {
        invoice_no,
        supplier_name,
        grand_total: grandTotal,
      },
      client
    );

    const savedItems = [];
    for (const item of preparedItems) {
      const savedItem = await purchaseModel.insertPurchaseItem(newPurchase.id, item, client);
      savedItems.push(savedItem);
      await productModel.increaseStock(item.product_id, item.quantity, client);
    }

    await client.query('COMMIT');
    return { ...newPurchase, items: savedItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updatePurchaseById(id, payload) {
  const purchase = await purchaseModel.updatePurchaseById(id, payload);
  if (!purchase) {
    const error = new Error(errorMessages.getPurchaseNotFoundMessage());
    error.code = 'PURCHASE_NOT_FOUND';
    throw error;
  }
  return purchase;
}

async function deletePurchaseById(id) {
  const purchase = await purchaseModel.deletePurchaseById(id);
    for (const item of order.items) {
      await productModel.increaseStock(item.product_id, item.quantity, client);
    }
    if (!order) {
      const error = new Error(errorMessages.getPurchaseNotFoundMessage());
      error.code = 'PURCHASE_NOT_FOUND';
      throw error;
    }
    return order;
}

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchaseById,
  deletePurchaseById,
};
