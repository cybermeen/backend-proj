const HTTP_STATUS = Object.freeze({
  OK: 200,                // data safely retrieved or updated.
  CREATED: 201,           // new resource successfully generated
  BAD_REQUEST: 400,       // server cannot parse the request due to malformed syntax
  UNAUTHORIZED: 401,      // authentication is required but has failed or not yet provided
  FORBIDDEN: 403,         // server understood the request but refuses to authorize it
  NOT_FOUND: 404,         // requested resource could not be found
  CONFLICT: 409,          // request could not be completed due to a conflict with the current state of the resource
  INTERNAL_SERVER_ERROR: 500, // server encountered an unexpected condition that prevented it from fulfilling the request
});

module.exports = HTTP_STATUS;