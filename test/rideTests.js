import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
describe('/GET rides', () => {
  it('it should GET all the rides', (done) => {
    chai.request(app)
      .get('/api/v1/rides')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('/GET/:id ride', () => {
  it('it should GET a ride by the given id', (done) => {
    chai.request(app)
      .get('/api/v1/rides/:id')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('/POST rides', () => {
  it('it should POST a ride', (done) => {
    const ride = {
      id: 4,
      date: '17-06-2018',
      driver: 'Niko Bellic',
      location: 'Apapa',
      destination: 'Badagry',
      requests: {},
    };
    chai.request(app)
      .post('/api/v1/rides')
      .send(ride)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('/POST rides/:id/requests', () => {
  it('it should POST a request to a ride of the given id', (done) => {
    chai.request(app)
      .post('/api/v1/rides/:id/requests')
      .send({ name: 'passenger' })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
