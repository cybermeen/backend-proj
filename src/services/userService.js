const userModel = require('../models/userModel');
const errorMessages = require('../utils/errorMessages');

async function getAllUsers() {
  const users = await userModel.getAllUsers();
  return users;
}

async function getUserById(id) {
  const user = await userModel.getUserById(id);
  if (!user) {
    const error = new Error(errorMessages.getUserNotFoundMessage());
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
}

async function deleteUserById(id) {
  const user = await userModel.deleteUserById(id);
  if (!user) {
    const error = new Error(errorMessages.getUserNotFoundMessage());
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
}

async function updateUserById(id, userData) {
  const user = await userModel.updateUserById(id, userData);
  if (!user) {
    const error = new Error(errorMessages.getUserNotFoundMessage());
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
}

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};