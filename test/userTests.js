import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';

const should = chai.should();

dotenv.config();

describe('/POST /auth/signup', () => {
  it('it should create a new user account successfully', (done) => {
    const userData = {
      firstName: 'Elijah',
      lastName: 'Udogu',
      username: 'elikeys',
      email: 'koppter.kom@gmail.com',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        done();
      });
  });

  it('it should ensure that no input field is empty', (done) => {
    let badUserData = {
      firstName: '',
      lastName: 'Udogu',
      username: 'elikeyz',
      email: 'koppter.kom@gmail.com',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
      });
    badUserData = {
      firstName: 'Elijah',
      lastName: '',
      username: 'elikeyz',
      email: 'koppter.kom@gmail.com',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
      });
    badUserData = {
      firstName: 'Elijah',
      lastName: 'Udogu',
      username: '',
      email: 'koppter.kom@gmail.com',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
      });
    badUserData = {
      firstName: 'Elijah',
      lastName: 'Udogu',
      username: 'elikeyz',
      email: '',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
      });
    badUserData = {
      firstName: 'Elijah',
      lastName: 'Udogu',
      username: 'elikeyz',
      email: 'koppter.kom@gmail.com',
      password: '',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

describe('/POST /auth/login', () => {
  it('it should login an existing user successfully', (done) => {
    const loginData = {
      username: 'elikeyz',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .type('form')
      .send(loginData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('accessToken');
        done();
      });
  });
  it('it should ensure that the user account exists', (done) => {
    const wrongUsername = {
      username: 'unknown',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .type('form')
      .send(wrongUsername)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it('it should ensure that the password is correct', (done) => {
    const wrongPassword = {
      username: 'elikeyz',
      password: 'unknown',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .type('form')
      .send(wrongPassword)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('it should ensure that no input field is empty', (done) => {
    let badUserData = {
      username: '',
      password: 'mastahacka',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
      });

    badUserData = {
      username: 'elikeyz',
      password: '',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .type('form')
      .send(badUserData)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
