import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';

const should = chai.should();

dotenv.config();

chai.use(chaiHttp);
describe('/GET rides', () => {
  it('it should GET all the rides', (done) => {
    chai.request(app)
      .get('/api/v1/rides')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/GET/:id ride', () => {
  it('it should GET a ride by the given id', (done) => {
    chai.request(app)
      .get('/api/v1/rides/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/POST rides', () => {
  it('it should POST a ride', (done) => {
    const ride = {
      headers: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3MjE1MDEsImV4cCI6MTUzMDgwNzkwMX0.GUyfpVtBGrZ7wdkGJEEfe85JenKDbD3RRWGCzr74Bq4'
      },
      body: {
        date: '17/06/2018',
        driver: 'Niko Bellic',
        location: 'Apapa',
        destination: 'Badagry',
        departure_time: '04:30 PM',
      }
    };
    chai.request(app)
      .post('/api/v1/users/rides')
      .type('form')
      .send(ride)
      .end((err, res) => {
        res.body.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/POST rides/:id/requests', () => {
  it('it should POST a request to a ride of the given id', (done) => {
    chai.request(app)
      .post('/api/v1/rides/1/requests')
      .send({ passenger: 'galahad' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('body');
        done();
      });
  });
});

