import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { check, ValidationError, validationResult } from 'express-validator';

import User, { UserDocument } from '../model/user';

export interface ErrnoException extends Error {
  statusCode: number;
  data?: ValidationError[];
}

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    await check('email').trim().isEmail().run(req);
    await check('password').trim().notEmpty().isLength({ min: 6 }).run(req);
    await check('username').trim().notEmpty().run(req);

    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      // ups!
      const err: ErrnoException = new Error('validation inputs ko') as ErrnoException;
      err.statusCode = 422;
      err.data = validation.array();
      throw err;
    }

    const { email, password, username } = req.body;

    const userDoc = await User.findOne({ email });

    if (userDoc) {
      // user with that email already exists
      const err: ErrnoException = new Error('Email already taken!') as ErrnoException;

      err.statusCode = 409;
      throw err;
    }

    // Encrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser: UserDocument = new User({
      email,
      username,
      password: hashPassword,
    });

    // save the user
    const userSaved = await newUser.save();

    if (userSaved !== newUser) {
      // Update not worked!
      const err: ErrnoException = new Error('Cannot save user') as ErrnoException;
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
