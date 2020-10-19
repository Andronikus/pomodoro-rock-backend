import { NextFunction, Request, Response } from 'express';

import { User, UserDocument } from '../model/user';

export interface ErrnoException extends Error {
  statusCode: number;
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  const { email, password, username } = req.body;

  try {
    const userDoc = await User.findOne({ email });

    console.log('userDoc', userDoc);

    if (userDoc) {
      // user with that email already exists
      const err: ErrnoException = new Error(
        'Email already taken!'
      ) as ErrnoException;

      err.statusCode = 409;
      throw err;
    }

    // TODO sanitize and validate input

    // Encrypt passoword

    // create a new user
    const newUser: UserDocument = new User({ email, username, password });

    // save the user
    const userSaved = await newUser.save();

    if (userSaved !== newUser) {
      // Update not worked!
      const err: ErrnoException = new Error(
        'Cannot save user'
      ) as ErrnoException;
      err.statusCode = 422;
      throw err;
    }

    return res.status(200).json({
      message: 'user saved successfully!',
      payload: {
        _id: userSaved._id,
      },
    });
  } catch (err) {
    if (err.code) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};
