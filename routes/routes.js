const fs = require('fs');

const appRouter = app => {
    app.get('/v1/rides', (req, res) => {
        fs.readFile( './models/rides.json', 'utf8', (err, data) => {
            console.log(data);
            res.end(data);
        });
    })    
}

module.exports = appRouter;