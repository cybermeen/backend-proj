const { verifyToken } = require('./jwtUtils');
const errorMessages = require('./errorMessages');
const HTTP_STATUS = require('./httpStatusCodes');

function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization'); // "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: errorMessages.getMissingTokenMessage() });
  }

  const token = authHeader.split(' ')[1]; // "Bearer abc123" -> ["Bearer", "abc123"] -> take index 1
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // attach the decoded identity to the request, for later handlers to use
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: errorMessages.getExpiredTokenMessage() });
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: errorMessages.getInvalidTokenMessage() });
  }
}

module.exports = authenticateToken;