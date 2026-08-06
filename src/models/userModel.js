const pool = require('../config/db');

// check for existing username/email before inserting
async function findByUsernameOrEmail(username, email) {
  const result = await pool.query (
    'SELECT * FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  return result.rows[0]; // undefined if no match
}

// find the account being logged into
async function findByUsername(username) {
  const result = await pool.query (
    `SELECT u.id, u.username, u.email, u.password, u.status, u.user_role_id, r.role_name,
     u.created_by, u.created_on, u.updated_by, u.updated_on
     FROM users u
     JOIN user_roles r ON u.user_role_id = r.id
     WHERE u.username = $1`, [username]);
  return result.rows[0];
}

// insert the new user row
async function createUser({ username, email, hashedPassword, status, user_role_id, created_by }) {
  const result = await pool.query (
    `INSERT INTO users (username, email, password, status, user_role_id, created_by, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6, $6)
     RETURNING id, username, email, status, user_role_id, created_by, created_on`,
    [username, email, hashedPassword, status, user_role_id, created_by]
  );
  return result.rows[0];
}

async function getAllUsers() {
  const result = await pool.query (
    `SELECT u.id,
    u.username,
    u.email,
    u.password,
    u.status,
    u.user_role_id,
    u.created_by,
    u.created_on,
    u.updated_by,
    u.updated_on,
    r.role_name
    FROM users u
    JOIN user_roles r
    ON u.user_role_id = r.id`
  );
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query (
    'SELECT * FROM users u JOIN user_roles r ON u.user_role_id = r.id WHERE u.id = $1',
    [id]
  );
  return result.rows[0];
}

async function deleteUserById(id) {
  const result = await pool.query (
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

async function updateUserById(id, { username, email, status, user_role_id, updated_by }) {
  const result = await pool.query (
    `UPDATE users SET username = $1, email = $2, status = $3, user_role_id = $4, updated_by = $5, updated_on = NOW()
     WHERE id = $6 RETURNING *`,
    [username, email, status, user_role_id, updated_by, id]
  );
  return result.rows[0];
}

module.exports = { findByUsernameOrEmail, findByUsername, createUser, getAllUsers, getUserById, deleteUserById, updateUserById };