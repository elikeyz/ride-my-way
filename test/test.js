process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET rides', () => {
    it('it should GET all the rides', (done) => {
        chai.request(app)
            .get('/api/v1/users/rides')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
            });
    });
});

describe('/GET/:id ride', () => {
    it('it should GET a ride by the given id', (done) => {
        let ride = rides[`ride${req.params.id}`];
        ride.save((err, ride) => {
            
        })
        chai.request(app)
        .get('/api/v1/users/rides/:id')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('date');
            res.body.should.have.property('driver');
            res.body.should.have.property('location');
            res.body.should.have.property('destination');
            res.body.should.have.property('id').eql(req.params.id);
        done();
        });
    });
});