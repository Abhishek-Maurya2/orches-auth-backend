const config = require('./config');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const app = require('./app');

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.port, () => {
      logger.info(`Authentication service running on port ${config.port}`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Closing server.`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', { error: error.message });
  process.exit(1);
});
