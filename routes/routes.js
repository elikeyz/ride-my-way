const fs = require('fs');

const appRouter = app => {
    app.get('/api/v1/users/rides', (req, res) => {
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            console.log(data);
            res.end(data);
        });
    })

    app.get('/api/v1/users/rides/:id', (req, res) => {
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            const rides = JSON.parse(data);
            const ride = rides[`ride${req.params.id}`];
            console.log(ride);
            res.end(JSON.stringify(ride));
        })
    })

    const newRide = {
        "ride4" : {
            "id" : 4,
            "date" : "17-06-2018",
            "driver" : "Niko Bellic",
            "location" : "Apapa",
            "destination" : "Badagry",
            "requests" : {}
        }
    }

    app.post('/api/v1/users/rides', (req, res) => {
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            rides = JSON.parse(data);
            rides["ride4"] = newRide["ride4"];
            console.log(rides);
            res.end(JSON.stringify(rides));
        })
    })
}

module.exports = appRouter;