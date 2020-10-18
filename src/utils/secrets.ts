import dotenv from 'dotenv';
import fs from 'fs';

import logger from './logger';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
  logger.debug('read .env file content to process.env');
}

export const ENVIRONMENT: string | undefined = process.env.NODE_ENV;

const isProductionEnv = ENVIRONMENT === 'production';

export const MONGODB_URI: string = (isProductionEnv
  ? process.env.MONGODB_URI
  : process.env.MONGODB_LOCAL_URI) as string;

if (!MONGODB_URI) {
  if (isProductionEnv) {
    logger.error('secrets:: MONGODB_URI not defined!');
  } else {
    logger.error('secrets:: MONGODB_LOCAL_URI not defined!');
  }

  process.exit(1);
}
