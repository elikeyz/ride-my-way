import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();
const should = chai.should();
chai.use(chaiHttp);

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

describe('/GET/:id ride', () => {
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

describe('/GET/users/rides/:id/requests', () => {
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

describe('/POST rides', () => {
  it('it should fail if the user is not logged in', (done) => {
    const rideData = {
      date: '10/25/2020',
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
      date: '10/25/2020',
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
      date: '10/25/2020',
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
      date: '10/25/2020',
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
      date: '10/25/2020',
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
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        done();
      });
  });
});

describe('/POST rides/:id/requests', () => {
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
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        done();
      });
  });
});

describe('/PUT users/rides/:rideid/requests/:requestid', () => {
  it('it should fail if the user is not logged in', (done) => {
    chai.request(app)
      .put('/api/v1/users/rides/1/requests/2')
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
      .put('/api/v1/users/rides/a/requests/2')
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
      .put('/api/v1/users/rides/1/requests/2')
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
      .put('/api/v1/users/rides/1000/requests/2')
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
      .put('/api/v1/users/rides/1/requests/2')
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

  it('it should PUT a response to a given request of a given ride', (done) => {
    chai.request(app)
      .put('/api/v1/users/rides/1/requests/2')
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
