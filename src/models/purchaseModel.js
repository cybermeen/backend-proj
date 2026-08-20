//purchase from supplier
const pool = require('../config/db');

async function getAllPurchases() {
  const result = await pool.query(
    'SELECT * FROM purchases ORDER BY "created_at" DESC'
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

async function insertPurchase({ invoice_no, supplier_name, grand_total, items, client = pool }) {
    const purchaseResult = await client.query(
      `INSERT INTO purchases (invoice_no, supplier_name, grand_total, "created_at", "updated_at")
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [invoice_no, supplier_name, grand_total]
    );
    return purchaseResult.rows[0];
}

async function insertPurchaseItem(purchaseId, item, client = pool) {
    const { product_id, product_name, cost_price, quantity, total } = item;
    const result = await client.query(
      `INSERT INTO purchase_items (purchase_id, product_id, product_name, cost_price, quantity, total)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [purchaseId, product_id, product_name, cost_price, quantity, total]
    );
    return result.rows[0];
}

async function updatePurchaseById(id, { invoice_no, supplier_name, grand_total }) {
  const result = await pool.query(
    `UPDATE purchases
     SET invoice_no = $1,
         supplier_name = $2,
         grand_total = $3,
         "updated_at" = NOW()
     WHERE id = $4 RETURNING *`,
    [invoice_no, supplier_name, grand_total, id]
  );
  return result.rows[0];
}

async function deletePurchaseById(id, client = pool) {
  await client.query('DELETE FROM purchase_items WHERE purchase_id = $1', [id]);
  const result = await client.query('DELETE FROM purchases WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  getAllPurchases,
  getPurchaseById,
  insertPurchase,
  insertPurchaseItem,
  updatePurchaseById,
  deletePurchaseById,
};
