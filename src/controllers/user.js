const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

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
      if (err.code) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};
