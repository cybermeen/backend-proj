const orderModel = require('../models/orderModel');
const errorMessages = require('../utils/errorMessages');

async function getAllOrders() {
  return orderModel.getAllOrders();
}

async function getOrderById(id) {
  const order = await orderModel.getOrderById(id);
  if (!order) {
    const error = new Error(errorMessages.getOrderNotFoundMessage());
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }
  return order;
}

async function createOrder(payload) {
  return orderModel.createOrder(payload);
}

async function updateOrderById(id, payload) {
  const order = await orderModel.updateOrderById(id, payload);
  if (!order) {
    const error = new Error(errorMessages.getOrderNotFoundMessage());
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }
  return order;
}

async function deleteOrderById(id) {
  const order = await orderModel.deleteOrderById(id);
  if (!order) {
    const error = new Error(errorMessages.getOrderNotFoundMessage());
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }
  return order;
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
