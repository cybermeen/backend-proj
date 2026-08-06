function getRegistrationValidationMessage() {
  return 'username, email, password, and user_role_id are required';
}

function getInvalidCredentialsMessage() {
  return 'Invalid username or password';
}

function getMissingCredentialsMessage() {
    return 'Username and password are required';
}

function getMissingApiKeyMessage() {
  return 'Missing API key. Include an x-api-key header.';
}

function getInvalidApiKeyMessage() {
  return 'Invalid or inactive API key.';
}

function getRegistrationFailedMessage() {
  return 'Registration failed';
}

function getLoginFailedMessage() {
  return 'Login failed';
}

function getAccountInactiveMessage() {
  return 'This account has been deactivated';
}

function getDuplicateUserMessage() {
  return 'Username or email is already registered';
}

function getInvalidRoleMessage() {
  return 'Invalid user_role_id — that role does not exist';
}

function getInvalidOrderPayloadMessage() {
  return 'Invalid order payload. Required fields: invoice_no, customer_name, payment_method, subtotal, grand_total, items';
}

function getOrderCreationFailedMessage() {
  return 'Order creation failed';
}

function getProductNotFoundMessage() {
  return 'Product not found';
}

function getPurchaseNotFoundMessage() {
  return 'Purchase not found';
}

function getOrderNotFoundMessage() {
  return 'Order not found';
}

function getApiKeyValidationFailedMessage() {
  return 'API key validation failed';
}

function getUsersNotFoundMessage() {
  return 'Users not found';
}

function getUserNotFoundMessage() {
  return 'User not found';
}

function getMissingTokenMessage() {
  return 'Missing or malformed Authorization header. Expected: Bearer <token>';
}
function getExpiredTokenMessage() {
  return 'Your session has expired. Please log in again';
}
function getInvalidTokenMessage() {
  return 'Invalid authentication token';
}

module.exports = {
  getRegistrationValidationMessage,
  getInvalidCredentialsMessage,
  getMissingCredentialsMessage,
  getMissingApiKeyMessage,
  getInvalidApiKeyMessage,
  getRegistrationFailedMessage,
  getLoginFailedMessage,
  getAccountInactiveMessage,
  getDuplicateUserMessage,
  getInvalidRoleMessage,
  getInvalidOrderPayloadMessage,
  getOrderCreationFailedMessage,
  getProductNotFoundMessage,
  getPurchaseNotFoundMessage,
  getOrderNotFoundMessage,
  getApiKeyValidationFailedMessage,
  getUsersNotFoundMessage,
  getUserNotFoundMessage,
  getMissingTokenMessage,
  getExpiredTokenMessage,
  getInvalidTokenMessage
};
