// responseHelper.js

/**
 * Helper function to standardize API responses.
 * @param {string} message - Response message
 * @param {boolean} status - Operation status (true for success, false for failure)
 * @param {Object} data - Data to be included in the response
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
function Response(message, status, data, statusCode, res) {
    res.status(statusCode).json({
        message,
        status,
        data
    });
}

module.exports = Response;
