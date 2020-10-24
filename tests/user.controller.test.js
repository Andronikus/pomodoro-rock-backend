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
});

// describe('Create a new user', function () {

//   it('should call next function with error object (statusCode = 422) when email in request body its not valid', async function (done) {
//     const req = {
//       body: {
//         email: 'qwerty@gmail.com',
//       },
//     };

//     const res = {};

//     const nextFunction = jest.fn((err) => err);

//     try {
//       await createUser(req, res, nextFunction);

//       expect(nextFunction).toBeCalled();
//       expect(nextFunction.mock.results[0].value.message).toBe('validation inputs ko');
//       expect(nextFunction.mock.results[0].value.statusCode).toBe(422);

//       done();
//     } catch (err) {
//       done(err);
//     }
//   });

// it('should create an user successfully, return 201 & a body with the new user _id ', async function (done) {
//   const mockUser = {
//     email: 'andronikus@gmail.com',
//     username: 'Andronikus',
//     password: 'qwerty',
//   };

//   // spyUser
//   const spyfindOneUser = jest.spyOn(User, 'findOne').mockReturnValueOnce(Promise.resolve(undefined));

//   const spySaveUser = jest.spyOn(User, 'save').mockReturnValueOnce(Promise.resolve(mockUser));

//   const req = {
//     body: mockUser,
//   };

//   const res = {
//     statusCode: 500,
//     body: {},
//     status: function (status) {
//       this.statusCode = status;
//     },
//     json: function (body) {
//       this.body = body;
//     },
//   };

//   const nextFunction = jest.fn((err) => err);

//   try {
//     await createUser(req, res, nextFunction);

//     expect(nextFunction).toBeCalled();
//     expect(nextFunction.mock.results[0].value.message).toBe('validation inputs ko');
//     expect(nextFunction.mock.results[0].value.statusCode).toBe(422);

//     done();
//   } catch (err) {
//     done(err);
//   }
// });
// });
