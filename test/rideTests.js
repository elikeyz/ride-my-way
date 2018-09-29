import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import app from '../app';

const should = chai.should();

dotenv.config();

chai.use(chaiHttp);

describe('/GET rides', () => {
  it('it should GET all the rides', (done) => {
    chai.request(app)
      .get('/api/v1/rides')
      .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/GET/:id ride', () => {
  it('it should GET a ride by the given id', (done) => {
    chai.request(app)
      .get('/api/v1/rides/1')
      .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/GET/users/rides/:id/requests', () => {
  it('it should GET all the requests of a specific ride', (done) => {
    chai.request(app)
      .get('/api/v1/users/rides/1/requests')
      .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/POST rides', () => {
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
  it('it should PUT a response to a given request of a given ride', (done) => {
    chai.request(app)
      .put('/api/v1/users/rides/1/requests/2')
      .type('form')
      .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
      .send({ accept: 'true' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        done();
      });
  });
});

describe('/GET users/requests', () => {
  it('it should GET all requests made by the signed in user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set({ token: jwt.sign({ id: 1 }, process.env.SECRET_KEY, { expiresIn: 86400 }) })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('success');
        res.body.should.have.property('body');
        res.body.body.should.be.a('array');
        done();
      });
  });
});
