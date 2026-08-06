const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const authenticateToken = require('../utils/authMiddleware');

async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();
    res.status(HTTP_STATUS.OK).json(orders);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUsersNotFoundMessage() });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(HTTP_STATUS.OK).json(order);
  } catch (err) {
    if (err.code === 'ORDER_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUsersNotFoundMessage() });
  }
}

async function createOrder(req, res) {
  try {
    const { invoice_no, customer_name, payment_method, subtotal, grand_total, items } = req.body;

    if (!invoice_no || !customer_name || !payment_method || subtotal == null || grand_total == null || !Array.isArray(items) || items.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidOrderPayloadMessage() });
    }

    const order = await orderService.createOrder(req.body);
    res.status(HTTP_STATUS.CREATED).json(order);
  } catch (err) {
    if (err.code === 'INVALID_ORDER_PAYLOAD') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getOrderCreationFailedMessage() });
  }
}

async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.updateOrderById(id, req.body);
    res.status(HTTP_STATUS.OK).json(order);
  } catch (err) {
    if (err.code === 'ORDER_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRegistrationFailedMessage() });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.deleteOrderById(id);
    res.status(HTTP_STATUS.OK).json(order);
  } catch (err) {
    if (err.code === 'ORDER_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRegistrationFailedMessage() });
  }
}

router.get('/', authenticateToken, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, createOrder);
router.put('/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);

module.exports = router;