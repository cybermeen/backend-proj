const pool = require('../config/db');

async function getAllOrders() {
  const result = await pool.query(
    'SELECT * FROM orders ORDER BY "created_at" DESC'
  );
  return result.rows;
}

async function getOrderById(id) {
  const result = await pool.query(
    `SELECT o.*,
            COALESCE(json_agg(json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'price', oi.price,
              'quantity', oi.quantity,
              'total', oi.total
            )) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.id = $1
     GROUP BY o.id`,
    [id]
  );
  return result.rows[0];
}

async function createOrder({ invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Order items are required and must be a non-empty array');
    error.code = 'INVALID_ORDER_PAYLOAD';
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total, "created_at", "updated_at")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total]
    );

    const order = orderResult.rows[0];
    const insertedItems = [];

    for (const item of items) {
      if (item.product_id == null || item.product_name == null || item.price == null || item.quantity == null || item.total == null) {
        const error = new Error('Each order item must include product_id, product_name, price, quantity, and total');
        error.code = 'INVALID_ORDER_PAYLOAD';
        throw error;
      }

      const result = await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [order.id, item.product_id, item.product_name, item.price, item.quantity, item.total]
      );
      insertedItems.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { ...order, items: insertedItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateOrderById(id, { invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total }) {
  const result = await pool.query(
    `UPDATE orders
     SET invoice_no = $1,
         customer_name = $2,
         payment_method = $3,
         subtotal = $4,
         tax = $5,
         discount = $6,
         grand_total = $7,
         "updated_at" = NOW()
     WHERE id = $8 RETURNING *`,
    [invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total, id]
  );
  return result.rows[0];
}

async function deleteOrderById(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    const result = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
