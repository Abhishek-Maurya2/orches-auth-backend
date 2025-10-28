const { body } = require('express-validator');
const config = require('../config');

const base64Regex = /^[A-Za-z0-9+/=]+$/;

const register = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('Valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone is required.'),
  body('profilePhoto')
    .optional()
    .isString()
    .matches(base64Regex)
    .withMessage('Profile photo must be a base64 encoded string.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
];

const login = [
  body('email').trim().isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const refresh = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
];

const logout = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
];

const forgotPassword = [
  body('email').trim().isEmail().withMessage('Valid email is required.'),
];

const resetPassword = [
  body('email').trim().isEmail().withMessage('Valid email is required.'),
  body('otp')
    .trim()
    .isNumeric()
    .withMessage('OTP must contain only digits.')
    .isLength({ min: config.otp.length, max: config.otp.length })
    .withMessage(`OTP must be ${config.otp.length} digits.`),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
];

const updateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty.'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Valid email is required.'),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone cannot be empty.'),
  body('profilePhoto')
    .optional()
    .isString()
    .matches(base64Regex)
    .withMessage('Profile photo must be a base64 encoded string.'),
];

module.exports = {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  updateProfile,
};
