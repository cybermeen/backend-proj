const pool = require('../config/db');
const errorMessages = require('./errorMessages');
const HTTP_STATUS = require('../utils/httpStatusCodes');

async function findApiKeyByValue(authkey) {
  const result = await pool.query(
    'SELECT * FROM api_key WHERE authkey = $1',
    [authkey]
  );
  return result.rows[0];
}

async function apiKeyMiddleware(req, res, next) {
  try {
    const providedKey = req.header('x-api-key');

    if (!providedKey) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: errorMessages.getMissingApiKeyMessage() });
    }

    const apiKeyRow = await findApiKeyByValue(providedKey);

    if (!apiKeyRow || apiKeyRow.active !== true) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ error: errorMessages.getInvalidApiKeyMessage() });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getApiKeyValidationFailedMessage() });
  }
}

module.exports = { apiKeyMiddleware, findApiKeyByValue };