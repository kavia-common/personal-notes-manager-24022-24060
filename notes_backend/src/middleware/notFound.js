'use strict';

/**
 * 404 Not Found handler for unmatched routes
 */
module.exports = function notFound(req, res) {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'Route not found',
  });
};
