//order by customer
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

async function insertOrder(orderData, client = pool) {
  const { invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total } = orderData;
  const result = await client.query(
    `INSERT INTO orders (invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total, "created_at", "updated_at")
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING *`,
    [invoice_no, customer_name, payment_method, subtotal, tax, discount, grand_total]
  );
  return result.rows[0];
}

async function insertOrderItem(orderId, item, client = pool) {
  const { product_id, product_name, price, quantity, total } = item;
  const result = await client.query(
    `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [orderId, product_id, product_name, price, quantity, total]
  );
  return result.rows[0];
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
  insertOrder,
  insertOrderItem,
  updateOrderById,
  deleteOrderById,
};
