const pool = require('../config/db');

async function getAllProducts() {
  const result = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ORDER BY p.id`
  );
  return result.rows;
}

async function getProductById(id) {
  const result = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function createProduct({ category_id, name, price, image, status, stock, minimum_stock }) {
  const result = await pool.query(
    `INSERT INTO products (category_id, name, price, image, status, stock, minimum_stock, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
    [category_id, name, price, image, status ?? true, stock ?? 0, minimum_stock ?? 0]
  );
  return result.rows[0];
}

async function updateProductById(id, { category_id, name, price, image, status, stock, minimum_stock }) {
  const result = await pool.query(
    `UPDATE products
     SET category_id = $1,
         name = $2,
         price = $3,
         image = $4,
         status = $5,
         stock = $6,
         minimum_stock = $7,
         "updatedAt" = NOW()
     WHERE id = $8 RETURNING *`,
    [category_id, name, price, image, status, stock, minimum_stock, id]
  );
  return result.rows[0];
}

async function deleteProductById(id) {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
