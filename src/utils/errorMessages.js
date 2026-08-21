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

function getOrderValidationMessage() {
  return 'Invalid order payload. Required fields: customer_name, payment_method, items';
}

function getOrderItemValidationMessage() {
  return 'Invalid order item payload. Required fields: product_id and quantity';
}

function getPurchaseValidationMessage() {
  return 'Invalid purchase payload. Required fields: invoice_no, supplier_name, items';
}

function getOrderCreationFailedMessage() {
  return 'Order creation failed';
}

function getOrderFetchFailedMessage() {
  return 'Unable to fetch order';
}

function getOrderProcessingFailedMessage() {
  return 'Order processing failed';
}

function getPurchaseCreationFailedMessage() {
  return 'Purchase creation failed';
}

function getPurchaseFetchFailedMessage() {
  return 'Unable to fetch purchase';
}

function getPurchaseProcessingFailedMessage() {
  return 'Purchase processing failed';
}

function getProductNotFoundMessage() {
  return 'Product not found';
}

function getProductFetchFailedMessage() {
  return 'Unable to fetch product';
}

function getProductCreationFailedMessage() {
  return 'Product creation failed';
}

function getProductProcessingFailedMessage() {
  return 'Product processing failed';
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

function getRoleNotFoundMessage() {
  return 'Role not found';
}

function getRolesFetchFailedMessage() {
  return 'Unable to fetch roles';
}

function getRoleFetchFailedMessage() {
  return 'Unable to fetch role';
}

function getRoleValidationMessage() {
  return 'role_name is required, and status must be a boolean when provided';
}

function getRoleCreationFailedMessage() {
  return 'Role creation failed';
}

function getRoleUpdateFailedMessage() {
  return 'Role update failed';
}

function getRoleDeleteFailedMessage() {
  return 'Role deletion failed';
}

function getDuplicateRoleMessage() {
  return 'Role name already exists';
}

function getRoleInUseMessage() {
  return 'Role cannot be deleted because it is assigned to a user';
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

function getMissingProductIdMessage() {
  return 'Missing productId query parameter';
}

function getFetchFailedMessage() {
  return 'Failed to fetch data';
}

function getInvalidDateMessage() {
  return 'Invalid date format. Use YYYY-MM-DD';
} 

function getInvalidDateRangeMessage() {
  return 'Invalid date range. Ensure both "from" and "to" are provided in YYYY-MM-DD format';
}

function getRouteNotFoundMessage() {
  return 'Route not found';
}

function getMalformedRequestMessage() {
  return 'Malformed request body. Ensure it is valid JSON';
}

function getUnexpectedErrorMessage() {
  return 'An unexpected error occurred. Please try again later';
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
  getOrderValidationMessage,
  getOrderItemValidationMessage,
  getPurchaseValidationMessage,
  getOrderCreationFailedMessage,
  getOrderFetchFailedMessage,
  getOrderProcessingFailedMessage,
  getPurchaseCreationFailedMessage,
  getPurchaseFetchFailedMessage,
  getPurchaseProcessingFailedMessage,
  getProductNotFoundMessage,
  getProductFetchFailedMessage,
  getProductCreationFailedMessage,
  getProductProcessingFailedMessage,
  getPurchaseNotFoundMessage,
  getOrderNotFoundMessage,
  getApiKeyValidationFailedMessage,
  getUsersNotFoundMessage,
  getUserNotFoundMessage,
  getRoleNotFoundMessage,
  getRolesFetchFailedMessage,
  getRoleFetchFailedMessage,
  getRoleValidationMessage,
  getRoleCreationFailedMessage,
  getRoleUpdateFailedMessage,
  getRoleDeleteFailedMessage,
  getDuplicateRoleMessage,
  getRoleInUseMessage,
  getMissingTokenMessage,
  getExpiredTokenMessage,
  getInvalidTokenMessage,
  getMissingProductIdMessage,
  getFetchFailedMessage,
  getInvalidDateMessage,
  getInvalidDateRangeMessage,
  getRouteNotFoundMessage,
  getMalformedRequestMessage,
  getUnexpectedErrorMessage
};
