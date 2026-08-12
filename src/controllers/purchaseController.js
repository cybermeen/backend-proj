const express = require('express');
const router = express.Router();

const purchaseService = require('../services/purchaseService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const authenticateToken = require('../utils/authMiddleware');

async function getAllPurchases(req, res) {
  try {
    const purchases = await purchaseService.getAllPurchases();
    res.status(HTTP_STATUS.OK).json(purchases);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getPurchaseFetchFailedMessage() });
  }
}

async function getPurchaseById(req, res) {
  try {
    const { id } = req.params;
    const purchase = await purchaseService.getPurchaseById(id);
    res.status(HTTP_STATUS.OK).json(purchase);
  } catch (err) {
    if (err.code === 'PURCHASE_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getPurchaseFetchFailedMessage() });
  }
}

async function createPurchase(req, res) {
  try {
    const purchase = await purchaseService.createPurchase(req.body);
    res.status(HTTP_STATUS.CREATED).json(purchase);
  } catch (err) {
    if (err.code === 'INVALID_PURCHASE_PAYLOAD') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: err.message });
    }
    if (err.code === 'PRODUCT_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getPurchaseCreationFailedMessage() });
  }
}

async function updatePurchase(req, res) {
  try {
    const { id } = req.params;
    const purchase = await purchaseService.updatePurchaseById(id, req.body);
    res.status(HTTP_STATUS.OK).json(purchase);
  } catch (err) {
    if (err.code === 'PURCHASE_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getPurchaseProcessingFailedMessage() });
  }
}

async function deletePurchase(req, res) {
  try {
    const { id } = req.params;
    const purchase = await purchaseService.deletePurchaseById(id);
    res.status(HTTP_STATUS.OK).json(purchase);
  } catch (err) {
    if (err.code === 'PURCHASE_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getPurchaseProcessingFailedMessage() });
  }
}

router.get('/', authenticateToken, getAllPurchases);
router.get('/:id', authenticateToken, getPurchaseById);
router.post('/', authenticateToken, createPurchase);
router.put('/:id', authenticateToken, updatePurchase);
router.delete('/:id', authenticateToken, deletePurchase);

module.exports = router;