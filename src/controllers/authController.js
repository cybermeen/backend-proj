const express = require('express');
const router = express.Router();

const authService = require('../services/authService');
const { findApiKeyByValue } = require('../utils/apiKeyValidation');
const errorMessages = require('../utils/errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');

const { generateToken } = require('../utils/jwtUtils');

async function register(req, res) {
  try {
    const { username, email, password, status, user_role_id, created_by } = req.body;

    if (!username || !email || !password || !user_role_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getRegistrationValidationMessage() });
    }

    const newUser = await authService.registerUser({ username, email, password, status, user_role_id, created_by });
    res.status(HTTP_STATUS.CREATED).json(newUser);
  } catch (err) {
    if (err.code === 'DUPLICATE_USER') return res.status(HTTP_STATUS.CONFLICT).json({ error: err.message });
    if (err.code === '23503') return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getInvalidRoleMessage() });
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getRegistrationFailedMessage() });
  }
}

async function login(req, res) {
  try {
    const { username, password, api_key: bodyApiKey } = req.body;
    const providedApiKey = req.header('x-api-key');


    if (!providedApiKey) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: errorMessages.getMissingApiKeyMessage() });
    }

    const apiKeyRow = await findApiKeyByValue(providedApiKey);
    if (!apiKeyRow || apiKeyRow.active !== true) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ error: errorMessages.getInvalidApiKeyMessage() });
    }

    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getMissingCredentialsMessage() });
    }

    const user = await authService.loginUser({ username, password });

    const token = generateToken({
      userId: user.id,
      username: user.username,
      roleId: user.user_role_id,
    });

    res.status(HTTP_STATUS.OK).json({ 
      status: "Success",
      message: "Login successful",
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
        role_detail: {
          user_role_id: user.user_role_id,
          role_name: user.role_name 
        }
      }
    });
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: err.message });
    if (err.code === 'ACCOUNT_INACTIVE') return res.status(HTTP_STATUS.FORBIDDEN).json({ error: err.message });
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getLoginFailedMessage() });
  }
}

router.post('/register', register);
router.post('/login', login);

module.exports = router;