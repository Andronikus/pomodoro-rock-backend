// Dummy test
import request from 'supertest';

import app from '../src/app';

describe('Get /', function () {
  it('should response with status code 200 and ok body message', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err) {
        if (err) throw err;
        done();
      });
  });
});
