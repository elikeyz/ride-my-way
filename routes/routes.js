const fs = require('fs');

const appRouter = app => {
    app.get('/api/v1/users/', (req, res) => {
        res.send('Welcome to the Ride My Way API, version 1! \nNavigate to /rides to get all rides. \nNavigate to /rides/{id} with ids 1, 2, and 3 to get each corresponding ride.');
    })

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

    app.post('/api/v1/users/rides', (req, res) => {
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
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            const rides = JSON.parse(data);
            rides["ride4"] = newRide["ride4"];
            console.log(rides);
            res.end(JSON.stringify(rides));
        })
    })

    app.post('/api/v1/users/rides/:id/requests', (req, res) => {
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            const rides = JSON.parse(data);
            const ride = rides[`ride${req.params.id}`];
            ride["requests"] = {"name": "passenger"};
            console.log(rides)
            res.end(JSON.stringify(rides));
        })
    })
}

module.exports = appRouter;