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
      .set({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3Nzk2MjIsImV4cCI6MTUzMDg2NjAyMn0.Dmx00DBm09nArQs2-6Oo1kzOLgkdhrhNgXmTeZ4pp1o' })
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
      .set({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3Nzk2MjIsImV4cCI6MTUzMDg2NjAyMn0.Dmx00DBm09nArQs2-6Oo1kzOLgkdhrhNgXmTeZ4pp1o' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/GET/users/rides/:id/requests', () => {
  it('it should GET all the requests of a specific ride', (done) => {
    chai.request(app)
      .get('/api/v1/users/rides/1/requests')
      .set({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3Nzk2MjIsImV4cCI6MTUzMDg2NjAyMn0.Dmx00DBm09nArQs2-6Oo1kzOLgkdhrhNgXmTeZ4pp1o' })
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
      date: '17/06/2018',
      driver: 'Niko Bellic',
      location: 'Apapa',
      destination: 'Badagry',
      departure_time: '04:30',
    };
    chai.request(app)
      .post('/api/v1/users/rides')
      .type('form')
      .set({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3Nzk2MjIsImV4cCI6MTUzMDg2NjAyMn0.Dmx00DBm09nArQs2-6Oo1kzOLgkdhrhNgXmTeZ4pp1o' })
      .send(ride)
      .end((err, res) => {
        res.should.have.status(201);
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
      .type('form')
      .set({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3Nzk2MjIsImV4cCI6MTUzMDg2NjAyMn0.Dmx00DBm09nArQs2-6Oo1kzOLgkdhrhNgXmTeZ4pp1o' })
      .send({ passenger: 'galahad' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('body');
        done();
      });
  });
});

describe('/PUT users/rides/:rideid/requests/:requestid', () => {
  it('it should PUT a response to a given request of a given ride', (done) => {
    chai.request(app)
      .put('/api/v1/users/rides/1/requests/2')
      .type('form')
      .set({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzA3Nzk2MjIsImV4cCI6MTUzMDg2NjAyMn0.Dmx00DBm09nArQs2-6Oo1kzOLgkdhrhNgXmTeZ4pp1o' })
      .send({ accept: 'true' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
