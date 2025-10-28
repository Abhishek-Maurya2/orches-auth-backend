const crypto = require('crypto');
const config = require('../config');
const { sendMail } = require('../config/mailer');

const generateOtp = (length) => {
  const digits = '0123456789';
  let otp = '';
  for (let index = 0; index < length; index += 1) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  return otp;
};

const sendResetOtpEmail = async ({ to, otp, expiresInMinutes, appName }) => {
  const subject = `${appName} password reset code`;
  const text = `Your password reset code is ${otp}. It expires in ${expiresInMinutes} minutes.`;
  const html = `<p>Your password reset code is <strong>${otp}</strong>.</p><p>The code expires in ${expiresInMinutes} minutes.</p>`;

  await sendMail({ to, subject, text, html });
};

const assignAndSendOtp = async ({ user, userService }) => {
  const otp = generateOtp(config.otp.length);
  const expiresAt = new Date(
    Date.now() + config.otp.expirationMinutes * 60 * 1000,
  );
  await userService.setResetOtp(user.id, otp, expiresAt);
  await sendResetOtpEmail({
    to: user.email,
    otp,
    expiresInMinutes: config.otp.expirationMinutes,
    appName: config.app.clientName,
  });
};

module.exports = {
  generateOtp,
  sendResetOtpEmail,
  assignAndSendOtp,
};
