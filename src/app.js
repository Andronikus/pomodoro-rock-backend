const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const userController = require('./controllers/user');
const logger = require('./utils/logger');
const { MONGODB_URI } = require('./utils/secrets');

const User = require('../src/model/user');

const app = express();

app.set('port', process.env.PORT || 3000);

// middleware
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.post('/signup', userController.createUser(User));

app.use((err, req, res, next) => {
  const statuCode = err.statusCode || 500;
  res.status(statuCode).json({
    message: err.message,
    payload: {
      data: err.data,
    },
  });
});

// connect to database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    logger.error(`Cannot connect to database ${MONGODB_URI}: err -> ${err}`);
  } else {
    logger.info(` Connected to database ${MONGODB_URI}`);
  }
});

module.exports = app;
