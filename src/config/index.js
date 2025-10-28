const dotenv = require('dotenv');

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 3000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth_service',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-access',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh',
    accessExpirationMinutes: toNumber(
      process.env.JWT_ACCESS_EXPIRATION_MINUTES,
      15,
    ),
    refreshExpirationDays: toNumber(process.env.JWT_REFRESH_EXPIRATION_DAYS, 7),
  },
  otp: {
    length: toNumber(process.env.RESET_OTP_LENGTH, 6),
    expirationMinutes: toNumber(process.env.RESET_OTP_EXPIRATION_MINUTES, 10),
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: toNumber(process.env.SMTP_PORT, 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
  },
  app: {
    clientName: process.env.APP_CLIENT_NAME || 'Your App',
  },
};
