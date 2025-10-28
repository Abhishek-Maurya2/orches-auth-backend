const ApiError = require('../utils/apiError');
const userService = require('./user.service');
const tokenService = require('./token.service');
const otpService = require('./otp.service');
const config = require('../config');

const sanitizeUser = (user) => user.toJSON();

const generateAuthTokens = (userId) => ({
  accessToken: tokenService.generateAccessToken(userId),
  refreshToken: tokenService.generateRefreshToken(userId),
  expiresIn: config.jwt.accessExpirationMinutes * 60,
});

const register = async (payload) => {
  const existingUser = await userService.findByEmail(payload.email);
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered.');
  }

  const existingPhone = await userService.findByPhone(payload.phone);
  if (existingPhone) {
    throw new ApiError(409, 'Phone number is already registered.');
  }

  const user = await userService.createUser(payload);
  const tokens = generateAuthTokens(user.id);

  return { user: sanitizeUser(user), tokens };
};

const login = async ({ email, password }) => {
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const isMatch = await userService.comparePassword(
    password,
    user.passwordHash,
  );
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const tokens = generateAuthTokens(user.id);
  return { user: sanitizeUser(user), tokens };
};

const refresh = async (refreshToken) => {
  try {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    const tokens = generateAuthTokens(payload.sub);
    return tokens;
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token.', true, {
      reason: error.message,
    });
  }
};

const logout = async (refreshToken) => {
  // In a production app, you would invalidate the refresh token
  // by adding it to a blacklist or removing it from a database
  try {
    tokenService.verifyRefreshToken(refreshToken);
    // Token is valid, logout successful
    return true;
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token.');
  }
};

const requestPasswordReset = async (email) => {
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  await otpService.assignAndSendOtp({ user, userService });
};

const resetPassword = async ({ email, otp, password }) => {
  const user = await userService.findByEmail(email);
  if (!user || !user.resetOtp || !user.resetOtpExpires) {
    throw new ApiError(400, 'OTP is invalid or expired.');
  }

  const now = new Date();
  if (user.resetOtp !== otp || now > user.resetOtpExpires) {
    throw new ApiError(400, 'OTP is invalid or expired.');
  }

  await userService.updatePassword(user.id, password);
  await userService.clearResetOtp(user.id);
};

const getCurrentUser = async (userId) => {
  const user = await userService.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return sanitizeUser(user);
};

const updateProfile = async (userId, payload) => {
  const allowedFields = ['name', 'email', 'phone', 'profilePhoto'];
  const updates = allowedFields.reduce((acc, field) => {
    if (typeof payload[field] !== 'undefined') {
      acc[field] = payload[field];
    }
    return acc;
  }, {});

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update.');
  }

  if (updates.email) {
    const existingEmail = await userService.findByEmail(updates.email);
    if (existingEmail && existingEmail.id !== userId) {
      throw new ApiError(409, 'Email is already registered.');
    }
  }

  if (updates.phone) {
    const existingPhone = await userService.findByPhone(updates.phone);
    if (existingPhone && existingPhone.id !== userId) {
      throw new ApiError(409, 'Phone number is already registered.');
    }
  }

  const updatedUser = await userService.updateProfile(userId, updates);

  if (!updatedUser) {
    throw new ApiError(404, 'User not found.');
  }

  return sanitizeUser(updatedUser);
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  requestPasswordReset,
  resetPassword,
  getCurrentUser,
  updateProfile,
};
