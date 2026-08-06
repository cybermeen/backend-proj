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

async function createPurchase(payload) {
  return purchaseModel.createPurchase(payload);
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
  if (!purchase) {
    const error = new Error(errorMessages.getPurchaseNotFoundMessage());
    error.code = 'PURCHASE_NOT_FOUND';
    throw error;
  }
  return purchase;
}

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchaseById,
  deletePurchaseById,
};
