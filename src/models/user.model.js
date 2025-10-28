const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetOtp: String,
    resetOtpExpires: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.resetOtp;
  delete obj.resetOtpExpires;
  return obj;
};

const User = model('User', userSchema);

module.exports = User;
