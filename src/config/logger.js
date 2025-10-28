const { createLogger, format, transports } = require('winston');
const config = require('./index');

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      message: info.message,
      stack: info.stack,
    });
  }
  return info;
});

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: format.combine(
    enumerateErrorFormat(),
    format.timestamp(),
    format.printf(({ level, message, timestamp, stack, ...meta }) => {
      const base = `${timestamp} [${level.toUpperCase()}] ${message}`;
      const metaString = Object.keys(meta).length
        ? ` ${JSON.stringify(meta)}`
        : '';
      const stackString = stack ? `\n${stack}` : '';
      return `${base}${metaString}${stackString}`;
    }),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
