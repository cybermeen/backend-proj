const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256', 
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  // refuse to even consider verifying a token that claims to use a different algorithm
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}

module.exports = { generateToken, verifyToken };