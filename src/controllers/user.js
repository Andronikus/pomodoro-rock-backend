const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = (model) => {
  return async (req, res, next) => {
    try {
      await check('email').trim().isEmail().run(req);
      await check('password').trim().notEmpty().isLength({ min: 6 }).run(req);
      await check('username').trim().notEmpty().run(req);

      const validation = validationResult(req);

      if (!validation.isEmpty()) {
        const err = new Error('validation inputs ko');
        err.statusCode = 422;
        err.data = validation.array();
        throw err;
      }

      const { email, password, username } = req.body;

      const userDoc = await model.findOne({ email });

      if (userDoc) {
        const err = new Error('Email already taken!');
        err.statusCode = 409;
        throw err;
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new model({
        email,
        username,
        password: hashPassword,
      });

      const userSaved = await newUser.save();

      if (userSaved !== newUser) {
        const err = new Error('Cannot save user');
        err.statusCode = 422;
        throw err;
      }

      return res.status(201).json({
        message: 'user saved successfully!',
        payload: {
          _id: userSaved._id,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};

exports.loginUser = (model) => {
  return async (req, res, next) => {
    try {
      await check('email').trim().isEmail().run(req);
      await check('password').trim().isLength({ min: 6 }).run(req);

      if (!validationResult(req).isEmpty()) {
        const err = new Error('validation inputs ko!');
        err.statusCode = 422;
        err.data = validationResult(req).array();
        throw err;
      }

      const { email, password } = req.body;

      const userDoc = await model.findOne({ email });

      if (!userDoc) {
        const err = new Error('invalid login!');
        err.statusCode = 404;
        throw err;
      }

      const matchPassword = await bcrypt.compare(password, userDoc.password);

      if (!matchPassword) {
        const err = new Error('invalid login');
        err.statusCode = 404;
        throw err;
      }

      // generate jwt token
      const payload = {
        _id: userDoc._id.toString(),
      };

      const jwtToken = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'user login successfully!',
        payload: {
          _id: userDoc._id,
          token: jwtToken,
        },
      });
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      next(err);
    }
  };
};
