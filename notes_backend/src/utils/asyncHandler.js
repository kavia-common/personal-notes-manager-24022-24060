'use strict';

/**
 * PUBLIC_INTERFACE
 * asyncHandler
 * Wrap async route handlers and forward errors to Express.
 */
function asyncHandler(fn) {
  /** This function returns an Express handler that catches rejections. */
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
