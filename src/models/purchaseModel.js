const pool = require('../config/db');

async function getAllPurchases() {
  const result = await pool.query(
    'SELECT * FROM purchases ORDER BY "createdAt" DESC'
  );
  return result.rows;
}

async function getPurchaseById(id) {
  const result = await pool.query(
    `SELECT p.*, 
            COALESCE(json_agg(json_build_object(
              'id', pi.id,
              'product_id', pi.product_id,
              'product_name', pi.product_name,
              'cost_price', pi.cost_price,
              'quantity', pi.quantity,
              'total', pi.total
            )) FILTER (WHERE pi.id IS NOT NULL), '[]') AS items
     FROM purchases p
     LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );
  return result.rows[0];
}

async function createPurchase({ invoice_no, supplier_name, grand_total, items }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const purchaseResult = await client.query(
      `INSERT INTO purchases (invoice_no, supplier_name, grand_total, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [invoice_no, supplier_name, grand_total]
    );

    const purchase = purchaseResult.rows[0];
    const insertedItems = [];

    for (const item of items) {
      const result = await client.query(
        `INSERT INTO purchase_items (purchase_id, product_id, product_name, cost_price, quantity, total)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [purchase.id, item.product_id, item.product_name, item.cost_price, item.quantity, item.total]
      );
      insertedItems.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { ...purchase, items: insertedItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updatePurchaseById(id, { invoice_no, supplier_name, grand_total }) {
  const result = await pool.query(
    `UPDATE purchases
     SET invoice_no = $1,
         supplier_name = $2,
         grand_total = $3,
         "updatedAt" = NOW()
     WHERE id = $4 RETURNING *`,
    [invoice_no, supplier_name, grand_total, id]
  );
  return result.rows[0];
}

async function deletePurchaseById(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM purchase_items WHERE purchase_id = $1', [id]);
    const result = await client.query('DELETE FROM purchases WHERE id = $1 RETURNING *', [id]);
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
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchaseById,
  deletePurchaseById,
};
