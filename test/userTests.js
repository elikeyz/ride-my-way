import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';

const should = chai.should();

dotenv.config();

describe('/POST /auth/signup', () => {
  it('it should create a new user account successfully', (done) => {
    const userData = {
      name: 'Elijah Udogu',
      username: 'elikeyz',
      email: 'koppter.kom@gmail.com',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('auth');
        res.body.should.have.property('accessToken');
        done();
      });
  });
});

