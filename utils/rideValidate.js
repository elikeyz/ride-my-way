const rideValidate = (req, res, next) => {
  if (!req.body.date) {
    res.status(401).send('Please enter your departure date');
  } else if (!req.body.driver) {
    res.status(401).send('Please enter your username');
  } else if (!req.body.location) {
    res.status(401).send('Please enter your departure location');
  } else if (!req.body.destination) {
    res.status(401).send('Please enter your destination');
  } else if (!req.body.departure_time) {
    res.status(401).send('Please indicate your departure time');
  } else {
    next();
  }
};

export default rideValidate;
