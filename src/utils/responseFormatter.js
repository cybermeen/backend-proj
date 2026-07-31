function successResponse(message, data = null) {
    return {
        status: "Success",
        message,
        data
    };
}

function errorResponse(message, data = null) {
    return {
        status: "Error",
        message,
        data
    };
}

module.exports = {
    successResponse,
    errorResponse
};