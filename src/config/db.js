const mongoose = require('mongoose');
const config = require('./index');
const logger = require('./logger');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error', { error: error.message });
    throw error;
  }
};

module.exports = connectDB;
