import winston from 'winston';

const ENV_PRODUCTION = 'production';
const NODE_ENV = process.env.NODE_ENV;

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: NODE_ENV === ENV_PRODUCTION ? 'error' : 'debug',
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
};

const logger = winston.createLogger(options);

if (NODE_ENV !== ENV_PRODUCTION) {
  logger.debug('Logging initialized at debug level');
}

export default logger;
