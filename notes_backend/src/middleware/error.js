'use strict';
const Logger = require('../config/logger');

/**
 * Centralized error handler
 */
module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const code = err.errorCode || 'INTERNAL_ERROR';

  Logger.error('Request failed', {
    status,
    code,
    path: req.originalUrl,
    method: req.method,
    message: err.message,
  });

  res.status(status).json({
    status: 'error',
    code,
    message: status >= 500 ? 'Internal Server Error' : err.message,
    timestamp: new Date().toISOString(),
  });
};
