import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import * as userController from './controllers/user';
import logger from './utils/logger';
import { MONGODB_URI } from './utils/secrets';

const app = express();

app.set('port', process.env.PORT || 3000);

// middleware
app.use(bodyParser.json());

// routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' });
});

app.post('/signup', userController.createUser);

app.use((err: userController.ErrnoException, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    message: 'Something went wrong!',
  });
});

// connect to database
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      logger.error(`Cannot connect to database ${MONGODB_URI}: err -> ${err}`);
    } else {
      logger.info(` Connected to database ${MONGODB_URI}`);
    }
  }
);

export default app;
