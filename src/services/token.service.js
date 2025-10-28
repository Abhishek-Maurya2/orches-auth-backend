const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, config.jwt.accessSecret, {
    expiresIn: `${config.jwt.accessExpirationMinutes}m`,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, config.jwt.refreshSecret, {
    expiresIn: `${config.jwt.refreshExpirationDays}d`,
  });
};

const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
