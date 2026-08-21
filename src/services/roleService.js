const roleModel = require('../models/roleModel');
const errorMessages = require('../utils/errorMessages');

async function getAllRoles() {
  return roleModel.getAllRoles();
}

async function getRoleById(id) {
  const role = await roleModel.getRoleById(id);
  if (!role) {
    const error = new Error(errorMessages.getRoleNotFoundMessage());
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }
  return role;
}

async function createRole(roleData) {
  return roleModel.createRole(roleData);
}

async function updateRoleById(id, roleData) {
  const role = await roleModel.updateRoleById(id, roleData);
  if (!role) {
    const error = new Error(errorMessages.getRoleNotFoundMessage());
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }
  return role;
}

async function deleteRoleById(id) {
  const role = await roleModel.deleteRoleById(id);
  if (!role) {
    const error = new Error(errorMessages.getRoleNotFoundMessage());
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }
  return role;
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRoleById,
  deleteRoleById,
};