const dotenv = require('dotenv');
const fs = require('fs');

const logger = require('./logger');

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
  logger.debug('read .env file content to process.env');
}

const ENVIRONMENT = process.env.NODE_ENV;

const isProductionEnv = ENVIRONMENT === 'production';

const MONGODB_URI = isProductionEnv ? process.env.MONGODB_URI : process.env.MONGODB_LOCAL_URI;

if (!MONGODB_URI) {
  if (isProductionEnv) {
    logger.error('secrets:: MONGODB_URI not defined!');
  } else {
    logger.error('secrets:: MONGODB_LOCAL_URI not defined!');
  }

  process.exit(1);
}

exports.ENVIRONMENT = ENVIRONMENT;
exports.MONGODB_URI = MONGODB_URI;
