const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/passwordHashing');
const errorMessages = require('../utils/errorMessages');

async function registerUser({ username, email, password, status, user_role_id, created_by }) {
  const existingUser = await userModel.findByUsernameOrEmail(username, email);
  if (existingUser) {
    const error = new Error(errorMessages.getDuplicateUserMessage());
    error.code = 'DUPLICATE_USER';
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await userModel.createUser({
    username,
    email,
    hashedPassword,
    status: status || 'active',
    user_role_id,
    created_by,
  });

  return newUser;
}

async function loginUser({ username, password }) {
  const user = await userModel.findByUsername(username);

  if (!user) {
    const error = new Error(errorMessages.getInvalidCredentialsMessage());
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    const error = new Error(errorMessages.getInvalidCredentialsMessage());
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.status === 'inactive') {
    const error = new Error(errorMessages.getAccountInactiveMessage());
    error.code = 'ACCOUNT_INACTIVE';
    throw error;
  }

  const { password: _removed, ...safeUser } = user;
  return safeUser;
}

module.exports = { registerUser, loginUser };