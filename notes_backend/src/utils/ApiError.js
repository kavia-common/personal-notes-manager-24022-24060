'use strict';

/**
 * PUBLIC_INTERFACE
 * ApiError
 * Represents an operational API error with status and message.
 */
class ApiError extends Error {
  /** This class augments Error with HTTP status and errorCode. */
  constructor(statusCode, message, errorCode = 'ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = ApiError;
