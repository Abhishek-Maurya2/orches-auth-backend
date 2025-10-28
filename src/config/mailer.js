const nodemailer = require('nodemailer');
const config = require('./index');
const logger = require('./logger');

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!config.smtp.host) {
    throw new Error('SMTP configuration is missing.');
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user
      ? {
          user: config.smtp.user,
          pass: config.smtp.pass,
        }
      : undefined,
  });

  return transporter;
};

const sendMail = async (options) => {
  const mailTransporter = getTransporter();
  const payload = {
    from: config.smtp.from,
    ...options,
  };

  const info = await mailTransporter.sendMail(payload);
  logger.info('Password reset email sent', { messageId: info.messageId });
  return info;
};

module.exports = {
  sendMail,
};
