const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const {
  notFoundHandler,
  errorConverter,
  errorHandler,
} = require('./middlewares/error.middleware');
const config = require('./config');
const logger = require('./config/logger');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
// Enable CORS for incoming requests. Use a permissive origin handler so
// the Access-Control-Allow-Origin header mirrors the request origin.
// Also explicitly enable handling of OPTIONS preflight requests.
app.use(cors({ origin: true, credentials: true }));
// Ensure preflight responses include CORS headers for all routes
app.options('*', cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler(logger, config.env !== 'production'));

module.exports = app;
