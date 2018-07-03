import fs from 'fs';

export function getAllRides(req, res) {
  fs.readFile('./models/rides.json', 'utf8', (err, data) => {
    res.status(200).send({
      message: 'Rides gotten successfully',
      success: true,
      body: data,
    });
  });
}

export function getARide(req, res) {
  fs.readFile('./models/rides.json', 'utf8', (err, data) => {
    const rides = JSON.parse(data);
    const ride = rides[`ride${req.params.id}`];
    res.status(200).send({
      message: 'Ride gotten successfully',
      success: true,
      body: JSON.stringify(ride),
    });
  });
}

export function addRide(req, res) {
  const newRide = {
    ride4: {
      id: 4,
      date: '17-06-2018',
      driver: 'Niko Bellic',
      location: 'Apapa',
      destination: 'Badagry',
      departure_time: '04:30 PM',
      requests: {},
    },
  };
  fs.readFile('./models/rides.json', 'utf8', (err, data) => {
    const rides = JSON.parse(data);
    rides.ride4 = newRide.ride4;
    res.status(201).send({
      message: 'Ride added successfully',
      success: true,
      body: JSON.stringify(rides),
    });
  });
}

export function addRequest(req, res) {
  fs.readFile('./models/rides.json', 'utf8', (err, data) => {
    const rides = JSON.parse(data);
    const ride = rides[`ride${req.params.id}`];
    ride.requests = { name: 'passenger' };
    res.status(201).send({
      message: 'Ride requested successfully',
      success: true,
      body: JSON.stringify(rides),
    });
  });
}
