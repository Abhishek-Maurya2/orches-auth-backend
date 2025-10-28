const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = async (password, hash) =>
  bcrypt.compare(password, hash);

const createUser = async ({ name, email, phone, profilePhoto, password }) => {
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    phone,
    profilePhoto,
    passwordHash,
  });
  return user;
};

const findByEmail = (email) => User.findOne({ email });

const findByPhone = (phone) => User.findOne({ phone });

const findById = (id) => User.findById(id);

const updateProfile = async (userId, updates) =>
  User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

const setResetOtp = async (userId, otp, expiresAt) => {
  await User.findByIdAndUpdate(userId, {
    resetOtp: otp,
    resetOtpExpires: expiresAt,
  });
};

const clearResetOtp = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    resetOtp: null,
    resetOtpExpires: null,
  });
};

const updatePassword = async (userId, password) => {
  const passwordHash = await hashPassword(password);
  await User.findByIdAndUpdate(userId, { passwordHash });
};

module.exports = {
  createUser,
  findByEmail,
  findByPhone,
  findById,
  comparePassword,
  setResetOtp,
  clearResetOtp,
  updatePassword,
  updateProfile,
};
