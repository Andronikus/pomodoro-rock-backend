import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { createUser } from '../src/controllers/user';
import User from '../src/model/user';

describe('Create a new user', function () {
  let spyHash: jest.SpyInstance;

  beforeAll(() => {
    spyHash = jest.spyOn(bcrypt, 'hash').mockImplementation((password, salt) => Promise.resolve(password));
  });

  afterAll(() => {
    spyHash.mockRestore();
  });

  it("should call next function with error object (statusCode = 422) when request body doesn't have email", async function (done) {
    const req: Request = {} as Request;
    const res: Response = {} as Response;

    const nextFunction = jest.fn((err) => err);

    try {
      await createUser(req, res, nextFunction);

      expect(nextFunction).toBeCalled();
      expect(nextFunction.mock.results[0].value.message).toBe('validation inputs ko');
      expect(nextFunction.mock.results[0].value.statusCode).toBe(422);

      done();
    } catch (err) {
      done(err);
    }
  });

  it('should call next function with error object (statusCode = 422) when email in request body its not valid', async function (done) {
    const req: Request = {
      body: {
        email: 'qwerty@gmail.com',
      },
    } as Request;

    const res: Response = {} as Response;

    const nextFunction = jest.fn((err) => err);

    try {
      await createUser(req, res, nextFunction);

      expect(nextFunction).toBeCalled();
      expect(nextFunction.mock.results[0].value.message).toBe('validation inputs ko');
      expect(nextFunction.mock.results[0].value.statusCode).toBe(422);

      done();
    } catch (err) {
      done(err);
    }
  });

  it('should create an user successfully, return 201 & a body with the new user _id ', async function (done) {
    const mockUser = {
      email: 'andronikus@gmail.com',
      username: 'Andronikus',
      password: 'qwerty',
    };

    // spyUser
    const spyfindOneUser: jest.SpyInstance = jest
      .spyOn(User, 'findOne')
      .mockReturnValueOnce(Promise.resolve(undefined) as any);

    const spySaveUser: jest.SpyInstance = jest
      .spyOn(User, 'save' as any)
      .mockReturnValueOnce(Promise.resolve(mockUser) as any);

    const req: Request = {
      body: userData,
    } as Request;

    const res = {
      statusCode: 500,
      body: {},
      status: function (status) {
        this.statusCode = status;
      },
      json: function (body) {
        this.body = body;
      },
    };

    const nextFunction = jest.fn((err) => err);

    try {
      await createUser(req, res, nextFunction);

      expect(nextFunction).toBeCalled();
      expect(nextFunction.mock.results[0].value.message).toBe('validation inputs ko');
      expect(nextFunction.mock.results[0].value.statusCode).toBe(422);

      done();
    } catch (err) {
      done(err);
    }
  });
});
