const pool = require('../config/db');

//dashboard
async function getCounters() {
  const result = await pool.query(`
    SELECT
      COALESCE((SELECT SUM(grand_total) FROM orders WHERE created_at::date = CURRENT_DATE), 0) AS today_sales,
      (SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE) AS today_orders,
      COALESCE((SELECT SUM(grand_total) FROM orders), 0) AS total_sales,
      (SELECT COUNT(*) FROM orders) AS total_orders,
      (SELECT COUNT(*) FROM products) AS total_products,
      (SELECT COUNT(*) FROM categories) AS total_categories,
      COALESCE((SELECT SUM(grand_total) FROM purchases), 0) AS total_purchases_amount,
      (SELECT COUNT(*) FROM products WHERE stock <= minimum_stock) AS low_stock_products
  `);
  return result.rows[0];
}

async function getSalesSummary() {
  const orderStats = await pool.query(`
    SELECT
      COALESCE(SUM(grand_total), 0) AS total_sales,
      COUNT(*) AS total_orders,
      COALESCE(ROUND(AVG(grand_total)::numeric, 2), 0) AS average_order_value,
      COALESCE(SUM(discount), 0) AS total_discount,
      COALESCE(SUM(tax), 0) AS total_tax
    FROM orders
  `);
  const itemStats = await pool.query(`
    SELECT COALESCE(SUM(quantity), 0) AS total_items_sold FROM order_items
  `);
  return { ...orderStats.rows[0], ...itemStats.rows[0] };
}

async function getDailySales(date) {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS orders,
       COALESCE(SUM(grand_total), 0) AS sales,
       COALESCE(SUM(tax), 0) AS tax,
       COALESCE(SUM(discount), 0) AS discount
     FROM orders
     WHERE created_at::date = $1`,
    [date]
  );
  return result.rows[0];
}

async function getSalesRange(from, to) {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total_orders,
       COALESCE(SUM(grand_total), 0) AS total_sales,
       COALESCE(SUM(tax), 0) AS total_tax,
       COALESCE(SUM(discount), 0) AS total_discount
     FROM orders
     WHERE created_at::date BETWEEN $1 AND $2`,
    [from, to]
  );
  return result.rows[0];
}

async function getPaymentsSummary() {
  const result = await pool.query(`
    SELECT payment_method, COUNT(*) AS orders, COALESCE(SUM(grand_total), 0) AS amount
    FROM orders
    GROUP BY payment_method
    ORDER BY amount DESC
  `);
  return result.rows;
}

async function getTopSellingProducts(limit) {
  const result = await pool.query(
    `SELECT product_id, product_name, SUM(quantity) AS quantity_sold, SUM(total) AS sales
     FROM order_items
     GROUP BY product_id, product_name
     ORDER BY quantity_sold DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function getProductSummary(productId) {
  const productResult = await pool.query('SELECT id, name, stock FROM products WHERE id = $1', [productId]);
  const product = productResult.rows[0];
  if (!product) return null;

  const producedResult = await pool.query(
    'SELECT COALESCE(SUM(quantity), 0) AS produced FROM purchase_items WHERE product_id = $1',
    [productId]
  );
  const soldResult = await pool.query(
    'SELECT COALESCE(SUM(quantity), 0) AS sold, COALESCE(SUM(total), 0) AS sales_amount FROM order_items WHERE product_id = $1',
    [productId]
  );

  return {
    productId: product.id,
    productName: product.name,
    produced: producedResult.rows[0].produced,
    sold: soldResult.rows[0].sold,
    remaining: product.stock,
    salesAmount: soldResult.rows[0].sales_amount,
  };
}

async function getCategorySummary() {
  const result = await pool.query(`
    SELECT c.id AS category_id, c.name AS category_name,
           COALESCE(SUM(oi.quantity), 0) AS items_sold,
           COALESCE(SUM(oi.total), 0) AS sales
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    LEFT JOIN order_items oi ON oi.product_id = p.id
    GROUP BY c.id, c.name
    ORDER BY sales DESC
  `);
  return result.rows;
}

async function getPurchasesSummary() {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_purchases,
      COALESCE(SUM(grand_total), 0) AS total_purchase_amount,
      COALESCE(ROUND(AVG(grand_total)::numeric, 2), 0) AS average_purchase
    FROM purchases
  `);
  return result.rows[0];
}

async function getDailyPurchases(date) {
  const result = await pool.query(
    `SELECT COUNT(*) AS purchase_count, COALESCE(SUM(grand_total), 0) AS total_amount
     FROM purchases
     WHERE created_at::date = $1`,
    [date]
  );
  return result.rows[0];
}

async function getInventorySummary() {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_products,
      COALESCE(SUM(stock), 0) AS total_stock,
      COUNT(*) FILTER (WHERE stock > 0 AND stock <= minimum_stock) AS low_stock_products,
      COUNT(*) FILTER (WHERE stock <= 0) AS out_of_stock_products
    FROM products
  `);
  return result.rows[0];
}

async function getLowStockInventory() {
  const result = await pool.query(`
    SELECT id AS product_id, name AS product_name, stock, minimum_stock
    FROM products
    WHERE stock <= minimum_stock
    ORDER BY stock ASC
  `);
  return result.rows;
}

module.exports = {
  getCounters, getSalesSummary, getDailySales, getSalesRange, getPaymentsSummary,
  getTopSellingProducts, getProductSummary, getCategorySummary,
  getPurchasesSummary, getDailyPurchases, getInventorySummary, getLowStockInventory,
};