const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.register(req.body);
    res.status(201).json({ data: user, tokens });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.login(req.body);
    res.status(200).json({ data: user, tokens });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.status(200).json({ tokens });
  } catch (error) {
    next(error);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    await authService.requestPasswordReset(req.body.email);
    res.status(200).json({ message: 'OTP sent to registered email.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  updateProfile,
};
