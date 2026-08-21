const express = require('express');
const router = express.Router();

const roleService = require('../services/roleService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const { successResponse } = require('../utils/responseFormatter');
const authenticateToken = require('../utils/authMiddleware');

async function getAllRoles(req, res) {
  try {
    const roles = await roleService.getAllRoles();
    res.status(HTTP_STATUS.OK).json(roles);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRolesFetchFailedMessage() });
  }
}

async function getRoleById(req, res) {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.status(HTTP_STATUS.OK).json(role);
  } catch (err) {
    if (err.code === 'ROLE_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRoleFetchFailedMessage() });
  }
}

async function createRole(req, res) {
  try {
    const { role_name, status } = req.body;
    if (!role_name || typeof role_name !== 'string' || !role_name.trim() || (status !== undefined && typeof status !== 'boolean')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getRoleValidationMessage() });
    }

    const role = await roleService.createRole({ role_name: role_name.trim(), status });
    res.status(HTTP_STATUS.CREATED).json(successResponse('Role created successfully', role));
  } catch (err) {
    if (err.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: errorMessages.getDuplicateRoleMessage() });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRoleCreationFailedMessage() });
  }
}

async function updateRole(req, res) {
  try {
    const { role_name, status } = req.body;
    if (!role_name || typeof role_name !== 'string' || !role_name.trim() || typeof status !== 'boolean') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getRoleValidationMessage() });
    }

    const role = await roleService.updateRoleById(req.params.id, { role_name: role_name.trim(), status });
    res.status(HTTP_STATUS.OK).json(successResponse('Role updated successfully', role));
  } catch (err) {
    if (err.code === 'ROLE_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    if (err.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: errorMessages.getDuplicateRoleMessage() });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRoleUpdateFailedMessage() });
  }
}

async function deleteRole(req, res) {
  try {
    const role = await roleService.deleteRoleById(req.params.id);
    res.status(HTTP_STATUS.OK).json(successResponse('Role deleted successfully', role));
  } catch (err) {
    if (err.code === 'ROLE_NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
    }
    if (err.code === '23503') {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: errorMessages.getRoleInUseMessage() });
    }
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRoleDeleteFailedMessage() });
  }
}

router.get('/', authenticateToken, getAllRoles);
router.get('/:id', authenticateToken, getRoleById);
router.post('/', authenticateToken, createRole);
router.put('/:id', authenticateToken, updateRole);
router.delete('/:id', authenticateToken, deleteRole);

module.exports = router;