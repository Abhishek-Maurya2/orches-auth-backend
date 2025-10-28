const ApiError = require('../utils/apiError');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, 'Resource not found'));
};

const errorConverter = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return next(new ApiError(statusCode, message, false));
};

const errorHandler = (logger, includeStack) => (err, req, res, _next) => {
  logger.error('API error', {
    statusCode: err.statusCode,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    details: err.details,
  });

  const response = {
    code: err.statusCode,
    message: err.message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (includeStack && err.stack) {
    response.stack = err.stack;
  }

  const statusCode = err.statusCode || 500;
  response.code = statusCode;

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorConverter,
  errorHandler,
};
