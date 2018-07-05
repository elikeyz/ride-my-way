const rideValidate = (req, res, next) => {
  if (!req.body.date) {
    res.status(401).send({
      message: 'Please enter your departure date',
      success: false,
    });
  } else if (!req.body.driver) {
    res.status(401).send({
      message: 'Please enter your username',
      success: false,
    });
  } else if (!req.body.location) {
    res.status(401).send({
      message: 'Please enter your departure location',
      success: false,
    });
  } else if (!req.body.destination) {
    res.status(401).send({
      message: 'Please enter your destination',
      success: false,
    });
  } else if (!req.body.departure_time) {
    res.status(401).send({
      message: 'Please indicate your departure time',
      success: false,
    });
  } else {
    next();
  }
};

export default rideValidate;
