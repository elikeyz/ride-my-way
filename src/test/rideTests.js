import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../app';
import dbconnect from '../utils/dbconnect';
import bcrypt from 'bcryptjs';

dotenv.config();
should();
chai.use(chaiHttp);

describe('rides', () => {
  beforeEach((done) => {
    dbconnect.query(`
      DROP TABLE requests;
      DROP TABLE rides;
      DROP TABLE users;
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        password VARCHAR
      );
      CREATE TABLE IF NOT EXISTS rides(
        id SERIAL PRIMARY KEY,
        date DATE,
        driver TEXT REFERENCES users(username),
        location TEXT,
        destination TEXT,
        departureTime TIME
      );
      CREATE TABLE IF NOT EXISTS requests(
        id SERIAL PRIMARY KEY,
        passenger TEXT REFERENCES users(username),
        rideId INTEGER REFERENCES rides(id),
        isAccepted BOOLEAN
      )
    `).then(() => {
      const hashedPassword = bcrypt.hashSync('mastahacka', 10);
      const textOne = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5);';
      const valuesOne = ['elikeyz', 'Elijah', 'Udogu', 'koppter.kom@gmail.com', hashedPassword];
      dbconnect.query(textOne, valuesOne).then(() => {
        const textTwo = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5);';
        const valuesTwo = ['galahad', 'Kome', 'Udogu', 'kay1.kom@gmail.com', hashedPassword];
        dbconnect.query(textTwo, valuesTwo).then(() => {
          done();
        });
      });
    });
  });

  describe('/GET rides', () => {
    it('it should fail if the user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/rides')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should GET all the rides', (done) => {
      chai.request(app)
        .get('/api/v1/rides')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Rides gotten successfully');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('body');
          done();
        });
    });
  });

  describe('/POST rides', () => {
    it('it should fail if the user is not logged in', (done) => {
      const rideData = {
        date: '10/25/3020',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if date is not provided', (done) => {
      const rideData = {
        date: '',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter your departure date');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if date provided is past', (done) => {
      const rideData = {
        date: '10/25/2010',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter a present or future date');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if no location is provided', (done) => {
      const rideData = {
        date: '10/25/3020',
        location: '',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter your departure location');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if destination is not provided', (done) => {
      const rideData = {
        date: '10/25/3020',
        location: 'Benin',
        destination: '',
        departureTime: '08:00',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter your destination');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if no departure time is provided', (done) => {
      const rideData = {
        date: '10/25/3020',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please indicate your departure time');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should create a ride offer successfully', (done) => {
      const rideData = {
        date: '10/25/3020',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      chai.request(app)
        .post('/api/v1/users/rides')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send(rideData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ride added successfully');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });

    it('it should fail if the ride offer already exists', (done) => {
      const rideData = {
        date: '10/25/3020',
        driver: 'galahad',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      const {
        date, driver, location, destination, departureTime
      } = rideData;
      const text = 'INSERT INTO rides(date, driver, location, destination, departureTime) VALUES($1, $2, $3, $4, $5)';
      const values = [date, driver, location, destination, departureTime];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/users/rides')
          .type('form')
          .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
          .send(rideData)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Ride already exists');
            res.body.should.have.property('success').eql(false);
            done();
          });
      });
    });
  });

  describe('/GET rides/:id', () => {
    beforeEach((done) => {
      const rideData = {
        date: '10/25/3020',
        driver: 'galahad',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      const {
        date, driver, location, destination, departureTime,
      } = rideData;
      const text = 'INSERT INTO rides(date, driver, location, destination, departureTime) VALUES($1, $2, $3, $4, $5)';
      const values = [date, driver, location, destination, departureTime];
      dbconnect.query(text, values).then(() => {
        done();
      });
    });

    it('it should fail if the user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/rides/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should ensure that the id is valid', (done) => {
      chai.request(app)
        .get('/api/v1/rides/a')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter a valid ID parameter');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail to GET a ride that does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/rides/10000')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ride does not exist');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should GET a ride by the given id', (done) => {
      chai.request(app)
        .get('/api/v1/rides/1')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ride gotten successfully');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('body');
          done();
        });
    });
  });

  describe('/GET users/rides/:id/requests', () => {
    beforeEach((done) => {
      const rideData = {
        date: '10/25/3020',
        driver: 'elikeyz',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      const {
        date, driver, location, destination, departureTime,
      } = rideData;
      const text = 'INSERT INTO rides(date, driver, location, destination, departureTime) VALUES($1, $2, $3, $4, $5)';
      const values = [date, driver, location, destination, departureTime];
      dbconnect.query(text, values).then(() => {
        done();
      });
    });

    it('it should fail if the user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/users/rides/1/requests')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should not respond to an unauthorized user', (done) => {
      chai.request(app)
        .get('/api/v1/users/rides/1/requests')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('You are not authorized to view the requests made to this ride');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should GET all the requests of a specific ride', (done) => {
      chai.request(app)
        .get('/api/v1/users/rides/1/requests')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Requests gotten successfully');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('body');
          done();
        });
    });
  });

  describe('/POST rides/:id/requests', () => {
    beforeEach((done) => {
      const rideData = {
        date: '10/25/3020',
        driver: 'elikeyz',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      const {
        date, driver, location, destination, departureTime,
      } = rideData;
      const text = 'INSERT INTO rides(date, driver, location, destination, departureTime) VALUES($1, $2, $3, $4, $5)';
      const values = [date, driver, location, destination, departureTime];
      dbconnect.query(text, values).then(() => {
        done();
      });
    });

    it('it should fail if the user is not logged in', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/requests')
        .type('form')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail to request for a non-existent ride', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1000/requests')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ride does not exist');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail to request for a ride belonging to the user', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/requests')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('You cannot request for your own ride');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should POST a request to a ride of the given id', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/requests')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ride requested successfully');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });

    it('it should fail to post a request that already exists', (done) => {
      const text = 'INSERT INTO requests(passenger, rideId) VALUES($1, $2)';
      const values = ['galahad', 1];
      dbconnect.query(text, values).then(() => {
        chai.request(app)
          .post('/api/v1/rides/1/requests')
          .type('form')
          .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Request already sent');
            res.body.should.have.property('success').eql(false);
            done();
          });
      });
    });
  });

  describe('/PUT users/rides/:rideid/requests/:requestid', () => {
    beforeEach((done) => {
      const rideData = {
        date: '10/25/3020',
        driver: 'elikeyz',
        location: 'Benin',
        destination: 'Lagos',
        departureTime: '08:00',
      };
      const {
        date, driver, location, destination, departureTime,
      } = rideData;
      const textOne = 'INSERT INTO rides(date, driver, location, destination, departureTime) VALUES($1, $2, $3, $4, $5)';
      const valuesOne = [date, driver, location, destination, departureTime];
      dbconnect.query(textOne, valuesOne).then(() => {
        const textTwo = 'INSERT INTO requests(passenger, rideId) VALUES($1, $2)';
        const valuesTwo = ['galahad', 1];
        dbconnect.query(textTwo, valuesTwo).then(() => {
          done();
        });
      });
    });

    it('it should fail if the user is not logged in', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/1')
        .type('form')
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if the ride ID is not valid', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/a/requests/1')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter a valid Ride ID parameter');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if the request ID is not valid', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/b')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter a valid Request ID parameter');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail if the response is not valid', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/1')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'maybe' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please enter true or false');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail to respond to a request made for a non-existent ride', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1000/requests/1')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ride does not exist');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail to respond to a non-existent request', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/2000')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Request does not exist');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should fail to respond to an unauthorized user', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/1')
        .type('form')
        .set({ token: jwt.sign({ id: 2 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('You are not authorized to respond to requests made to this ride');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should successfully accept a given request of a given ride', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/1')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'true' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Request accepted');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });

    it('it should successfully reject a given request of a given ride', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/1/requests/1')
        .type('form')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .send({ accept: 'false' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Request rejected');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
  });

  describe('/GET users/requests', () => {
    it('it should fail if the user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Please log in');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('it should GET all requests made by the signed in user', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User\'s Requests gotten successfully');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('body');
          res.body.body.should.be.a('array');
          done();
        });
    });
  });
});
