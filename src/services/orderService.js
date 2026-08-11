const pool = require('../config/db');
const productModel = require('../models/productModel');
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

async function createOrder({ customer_name, payment_method, discount, tax, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error(errorMessages.getOrderValidationMessage());
    error.code = 'INVALID_ORDER_PAYLOAD';
    throw error;
  }

  for (const item of items) {
    if (item.product_id == null || item.quantity == null || item.quantity <= 0) {
      const error = new Error(errorMessages.getOrderItemValidationMessage());
      error.code = 'INVALID_ORDER_PAYLOAD';
      throw error;
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let subtotal = 0;
    const preparedItems = [];

    //validate that the product exists
    for (const item of items) {
      const product = await productModel.getProductById(item.product_id, client);

      if (!product) {
        const error = new Error(`Product with id ${item.product_id} does not exist`);
        error.code = 'PRODUCT_NOT_FOUND';
        throw error;
      }

      //validate that the product has enough stock
      if (product.stock < item.quantity) {
        const error = new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
        );
        error.code = 'INSUFFICIENT_STOCK';
        throw error;
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      preparedItems.push({
        product_id: product.id,
        product_name: product.name,
        price: unitPrice,
        quantity: item.quantity,
        total: lineTotal,
      });
    }

    const taxAmount = Number(tax) || 0;
    const discountAmount = Number(discount) || 0;
    const grandTotal = subtotal + taxAmount - discountAmount;
    const invoiceNo = `INV-${Date.now()}`;  //randomized invoice number

    const newOrder = await orderModel.insertOrder(
      {
        invoice_no: invoiceNo,
        customer_name,
        payment_method,
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        grand_total: grandTotal,
      },
      client
    );

    const savedItems = [];
    for (const item of preparedItems) {
      const savedItem = await orderModel.insertOrderItem(newOrder.id, item, client);
      savedItems.push(savedItem);
      await productModel.decreaseStock(item.product_id, item.quantity, client);
    }

    await client.query('COMMIT');
    return { ...newOrder, items: savedItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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

//cancellation of order
async function deleteOrderById(id) {
  const order = await orderModel.deleteOrderById(id);
  //increase stock for all items in the order
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const item of order.items) {
      await productModel.increaseStock(item.product_id, item.quantity, client);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
