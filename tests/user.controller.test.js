const User = require('../src/model/__mocks__/user').User;
const createUser = require('../src/controllers/user').createUser(User);

describe('Create a new user controller', function () {
  it('should create an user successfully, return 201 & a body with the new user _id', async (done) => {
    // Preparation
    const MockData = {
      email: 'tiagoafroque@gmail.com',
      password: 'querty',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    const save = function () {
      this['_id'] = MockData._id;
      return Promise.resolve(this);
    };

    jest.spyOn(User.prototype, 'save').mockImplementationOnce(save);
    const nextFunction = jest.fn((err) => console.log('next', err));

    const req = {
      body: MockData,
    };

    const res = {
      body: {},
      statusCode: undefined,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };

    // call
    await createUser(req, res, nextFunction);

    // expects
    expect(res.statusCode).toBe(201);
    expect(res.body).toBeTruthy();
    expect(res.body.message).toMatch(/successfully/);
    expect(res.body.payload._id).toBe(MockData._id);

    done();
  });

  it("should call next function with error object (statusCode = 422) when request body doesn't have email", async function (done) {
    const req = {};
    const res = {};

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
    const MockData = {
      email: 'andronikus@gmail',
      password: 'querty',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    const req = {
      body: MockData,
    };

    const res = {};

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

  it('should call next function with error object (statusCode = 422) when pw is empty', async function (done) {
    const MockData = {
      email: 'andronikus@gmail.com',
      password: '',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    const req = {
      body: MockData,
    };

    const res = {};

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

  it('should call next function with error object (statusCode = 422) when pw requirements are not full filled', async function (done) {
    const MockData = {
      email: 'andronikus@gmail.com',
      password: '12345',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    const req = {
      body: MockData,
    };

    const res = {};

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

  it('should call next function with error object (statusCode = 422) when username is empty', async function (done) {
    const MockData = {
      email: 'andronikus@gmail.com',
      password: '12345',
      username: '',
      _id: 'abc123def456',
    };

    const req = {
      body: MockData,
    };

    const res = {};

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

  it('should call next function with error object (statusCode = 409) when email already exists', async function () {
    // Preparation
    const MockData = {
      email: 'andronikus@gmail.com',
      password: 'querty',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    jest.spyOn(User, 'findOne').mockImplementationOnce(() => Promise.resolve(MockData));

    const nextFunction = jest.fn((err) => err);

    const req = {
      body: MockData,
    };

    const res = {
      body: {},
      statusCode: undefined,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };

    // call
    await createUser(req, res, nextFunction);

    // expectation
    expect(nextFunction).toBeCalled();
    expect(nextFunction.mock.results[0].value.statusCode).toBe(409);
  });

  it('should call next function with error object (statusCode = 422) when save return falsy', async function () {
    // Preparation
    const MockData = {
      email: 'andronikus@gmail.com',
      password: 'querty',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    const nextFunction = jest.fn((err) => err);

    const req = {
      body: MockData,
    };

    const res = {
      body: {},
      statusCode: undefined,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };

    // call
    await createUser(req, res, nextFunction);

    // expectation
    expect(nextFunction).toBeCalled();
    expect(nextFunction.mock.results[0].value.statusCode).toBe(422);
    expect(nextFunction.mock.results[0].value.message).toBe('Cannot save user');
  });

  it('should call next function with error object (statusCode = 500) when an exception on save', async function () {
    // Preparation
    const MockData = {
      email: 'andronikus@gmail.com',
      password: 'querty',
      username: 'Andronikus',
      _id: 'abc123def456',
    };

    jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => {
      throw new Error();
    });

    const nextFunction = jest.fn((err) => err);

    const req = {
      body: MockData,
    };

    const res = {
      body: {},
      statusCode: undefined,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };

    // call
    await createUser(req, res, nextFunction);

    // expectation
    expect(nextFunction).toBeCalled();
    expect(nextFunction.mock.results[0].value.statusCode).toBe(500);
  });
});
