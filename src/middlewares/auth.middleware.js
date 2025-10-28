const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../services/token.service');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token missing'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (error) {
    return next(
      new ApiError(401, 'Invalid or expired token', true, {
        reason: error.message,
      }),
    );
  }
};

module.exports = authenticate;
