import fs from 'fs';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Ride My Way API, version 1! \nNavigate to /rides to get all rides. \nNavigate to /rides/{id} with ids 1, 2, and 3 to get each corresponding ride. \nRun POST requests on /rides to add a sample ride and on /rides/{id}/requests to create a sample request on any of the rides.');
  });

  app.get('/api/v1/rides', (req, res) => {
    fs.readFile('./models/rides.json', 'utf8', (err, data) => {
      res.send(data);
    });
  });

  app.get('/api/v1/rides/:id', (req, res) => {
    fs.readFile('./models/rides.json', 'utf8', (err, data) => {
      const rides = JSON.parse(data);
      const ride = rides[`ride${req.params.id}`];
      res.send(JSON.stringify(ride));
    });
  });

  app.post('/api/v1/rides', (req, res) => {
    const newRide = {
      ride4: {
        id: 4,
        date: '17-06-2018',
        driver: 'Niko Bellic',
        location: 'Apapa',
        destination: 'Badagry',
        requests: {},
      },
    };
    fs.readFile('./models/rides.json', 'utf8', (err, data) => {
      const rides = JSON.parse(data);
      rides.ride4 = newRide.ride4;
      res.send(JSON.stringify(rides));
    });
  });

  app.post('/api/v1/rides/:id/requests', (req, res) => {
    fs.readFile('./models/rides.json', 'utf8', (err, data) => {
      const rides = JSON.parse(data);
      const ride = rides[`ride${req.params.id}`];
      ride.requests = { name: 'passenger' };
      res.send(JSON.stringify(rides));
    });
  });
};

export default routes;
