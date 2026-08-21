const pool = require('../config/db');

async function getAllRoles() {
  const result = await pool.query(
    'SELECT * FROM user_roles ORDER BY id'
  );
  return result.rows;
}

async function getRoleById(id) {
  const result = await pool.query(
    'SELECT * FROM user_roles WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function createRole({ role_name, status }) {
  const result = await pool.query(
    `INSERT INTO user_roles (role_name)
     VALUES ($1)
     RETURNING *`,
    [role_name]
  );
  return result.rows[0];
}

async function updateRoleById(id, { role_name, status }) {
  const result = await pool.query(
    `UPDATE user_roles
     SET role_name = $1
     WHERE id = $2
     RETURNING *`,
    [role_name, id]
  );
  return result.rows[0];
}

async function deleteRoleById(id) {
  const result = await pool.query(
    'DELETE FROM user_roles WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRoleById,
  deleteRoleById,
};