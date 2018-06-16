const fs = require('fs');

const appRouter = app => {
    app.get('/v1/rides', (req, res) => {
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            console.log(data);
            res.end(data);
        });
    })

    app.get('/v1/rides/:id', (req, res) => {
        fs.readFile('./models/rides.json', 'utf8', (err, data) => {
            const rides = JSON.parse(data);
            const ride = rides[`ride${req.params.id}`];
            console.log(ride);
            res.end(JSON.stringify(ride));
        })
    })
}

module.exports = appRouter;