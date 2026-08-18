const express = require('express');
const router = express.Router();

const reportsService = require('../services/reportsService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const { successResponse } = require('../utils/responseFormatter');
const authenticateToken = require('../utils/authMiddleware');

async function getCounters(req, res) {
  try {
    const data = await reportsService.getCounters();
    res.status(HTTP_STATUS.OK).json(successResponse('Dashboard counters retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

async function salesSummary(req, res) {
  try {
    const data = await reportsService.getSalesSummary();
    res.status(HTTP_STATUS.OK).json(successResponse('Sales summary retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function dailySales(req, res) {
  try {
    const { date } = req.query;
    if (!date || !DATE_REGEX.test(date)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidDateMessage() });
    }
    const data = await reportsService.getDailySales(date);
    res.status(HTTP_STATUS.OK).json(successResponse('Daily sales retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function salesRange(req, res) {
  try {
    const { from, to } = req.query;
    if (!from || !to || !DATE_REGEX.test(from) || !DATE_REGEX.test(to)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidDateRangeMessage() });
    }
    const data = await reportsService.getSalesRange(from, to);
    res.status(HTTP_STATUS.OK).json(successResponse('Sales range retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function paymentsSummary(req, res) {
  try {
    const data = await reportsService.getPaymentsSummary();
    res.status(HTTP_STATUS.OK).json(successResponse('Payments summary retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function topSellingProducts(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;
    const data = await reportsService.getTopSellingProducts(limit);
    res.status(HTTP_STATUS.OK).json(successResponse('Top selling products retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function productSummary(req, res) {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getMissingProductIdMessage() });
    }
    const data = await reportsService.getProductSummary(productId);
    res.status(HTTP_STATUS.OK).json(successResponse('Product summary retrieved', data));
  } catch (err) {
    if (err.code === 'PRODUCT_NOT_FOUND') return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function categorySummary(req, res) {
  try {
    const data = await reportsService.getCategorySummary();
    res.status(HTTP_STATUS.OK).json(successResponse('Category summary retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function purchasesSummary(req, res) {
  try {
    const data = await reportsService.getPurchasesSummary();
    res.status(HTTP_STATUS.OK).json(successResponse('Purchases summary retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function dailyPurchases(req, res) {
  try {
    const { date } = req.query;
    if (!date || !DATE_REGEX.test(date)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidDateMessage() });
    }
    const data = await reportsService.getDailyPurchases(date);
    res.status(HTTP_STATUS.OK).json(successResponse('Daily purchases retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function inventorySummary(req, res) {
  try {
    const data = await reportsService.getInventorySummary();
    res.status(HTTP_STATUS.OK).json(successResponse('Inventory summary retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

async function lowStockInventory(req, res) {
  try {
    const data = await reportsService.getLowStockInventory();
    res.status(HTTP_STATUS.OK).json(successResponse('Low stock inventory retrieved', data));
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getFetchFailedMessage() });
  }
}

router.get('/counters', authenticateToken, getCounters);
router.get('/sales/summary', authenticateToken, salesSummary);
router.get('/sales/daily', authenticateToken, dailySales);
router.get('/sales', authenticateToken, salesRange);
router.get('/payments/summary', authenticateToken, paymentsSummary);
router.get('/products/top-selling', authenticateToken, topSellingProducts);
router.get('/products/summary', authenticateToken, productSummary);
router.get('/categories/summary', authenticateToken, categorySummary);
router.get('/purchases/summary', authenticateToken, purchasesSummary);
router.get('/purchases/daily', authenticateToken, dailyPurchases);
router.get('/inventory/summary', authenticateToken, inventorySummary);
router.get('/inventory/low-stock', authenticateToken, lowStockInventory);

module.exports = router;