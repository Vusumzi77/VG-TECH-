/**
 * Central error-handling middleware for Express.
 * Must be registered LAST (after all routes).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
