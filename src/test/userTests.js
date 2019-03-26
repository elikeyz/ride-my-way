import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import app from '../app';
import dbconnect from '../utils/dbconnect';

should();
chai.use(chaiHttp);

describe('auth', () => {
  beforeEach((done) => {
    dbconnect.query(`
      DELETE FROM requests;
      DELETE FROM rides;
      DELETE FROM users;
    `).then(() => {
      done();
    });
  });

  describe('/GET /', () => {
    it('it should load the base URL successfully', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/POST /auth/signup', () => {
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
          res.body.should.have.property('message').eql('Please enter your first name');
          res.body.should.have.property('success').eql(false);
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
          res.body.should.have.property('message').eql('Please enter your last name');
          res.body.should.have.property('success').eql(false);
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
          res.body.should.have.property('message').eql('Please enter your username');
          res.body.should.have.property('success').eql(false);
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
          res.body.should.have.property('message').eql('Please enter your email');
          res.body.should.have.property('success').eql(false);
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
          res.body.should.have.property('message').eql('Please enter your password');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should create a new user account successfully', (done) => {
      const userData = {
        firstName: 'Elijah',
        lastName: 'Udogu',
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
          res.body.should.have.property('message').eql('User account created successfully');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });

    it('it should fail if an identical user exists on the database', (done) => {
      const userData = {
        firstName: 'Elijah',
        lastName: 'Udogu',
        username: 'elikeyz',
        email: 'koppter.kom@gmail.com',
        password: 'mastahacka',
      };
      const { firstName, lastName, username, email, password } = userData;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const text = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5)';
      const values = [username, firstName, lastName, email, hashedPassword];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .type('form')
          .send(userData)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.have.property('message').eql('Username already exists');
            res.body.should.have.property('success').eql(false);
            done();
          });
      });
    });
  });

  describe('/POST /auth/login', () => {
    it('it should login an existing user successfully', (done) => {
      const loginData = {
        username: 'elikeyz',
        password: 'mastahacka',
      };
      const { username, password } = loginData;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const text = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5)';
      const values = [username, 'Elijah', 'Udogu', 'koppter.kom@gmail.com', hashedPassword];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .type('form')
          .send(loginData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User logged in successfully');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('accessToken');
            res.body.should.have.property('user');
            res.body.user.should.be.a('object');
            done();
          });
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
          res.body.should.have.property('message').eql('User account not found!');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
    it('it should ensure that the password is correct', (done) => {
      const wrongPassword = {
        username: 'elikeyz',
        password: 'unknown',
      };
      const { username } = wrongPassword;
      const hashedPassword = bcrypt.hashSync('mastahacka', 10);
      const text = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5)';
      const values = [username, 'Elijah', 'Udogu', 'koppter.kom@gmail.com', hashedPassword];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .type('form')
          .send(wrongPassword)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('message').eql('Wrong password!');
            res.body.should.have.property('success').eql(false);
            done();
          });
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
          res.body.should.have.property('message').eql('Please enter your username');
          res.body.should.have.property('success').eql(false);
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
          res.body.should.have.property('message').eql('Please enter your password');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
  });
});
