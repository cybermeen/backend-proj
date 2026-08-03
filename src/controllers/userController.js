const express = require('express');
const router = express.Router();

const userService = require('../services/userService');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');
const authenticateToken = require('../utils/authMiddleware');

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUsersNotFoundMessage() });
  }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        res.status(HTTP_STATUS.OK).json(user);
    } catch (err) {
        if (err.code === 'USER_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
        }
        console.error(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUserNotFoundMessage() });
    }
}

async function deleteUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await userService.deleteUserById(id);
        res.status(HTTP_STATUS.OK).json(user);
    } catch (err) {
        if (err.code === 'USER_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
        }
        console.error(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUserNotFoundMessage() });
    }
}

async function updateUserById(req, res) {
    try {
        const { id } = req.params;
        const userData = req.body;
        const user = await userService.updateUserById(id, userData);
        res.status(HTTP_STATUS.OK).json(user);
    } catch (err) {
        if (err.code === 'USER_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message });
        }
        console.error(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUserNotFoundMessage() });
    }
}

router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUserById);
router.delete('/:id', authenticateToken, deleteUserById);

module.exports = router;

