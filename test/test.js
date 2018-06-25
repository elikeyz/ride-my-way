process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET rides', () => {
    it('it should GET all the rides', (done) => {
        chai.request(app)
            .get('/api/v1/rides')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
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
            res.body.should.be.a('object');
        done();
        });
    });
});

describe('/POST rides', () => {
    it('it should POST a ride', (done) => {
        let ride = {
            "id" : 4,
            "date" : "17-06-2018",
            "driver" : "Niko Bellic",
            "location" : "Apapa",
            "destination" : "Badagry",
            "requests" : {}
        }
        chai.request(app)
        .post('/api/v1/rides')
        .send(ride)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST rides/:id/requests', () => {
    it('it should POST a request to a ride of the given id', (done) => {
        let ride = {
            "id" : 1,
            "date" : "15-06-2018",
            "driver" : "John Doe",
            "location" : "Lekki",
            "destination" : "Ilupeju",
            "requests" : {}
        }
        chai.request(app)
        .post('/api/v1/rides/:id/requests')
        .send({"name" : "passenger"})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        })
    })
})