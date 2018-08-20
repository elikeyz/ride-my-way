const rideValidate = (req, res, next) => {
  if (!req.body.date.trim()) {
    res.status(401).send({
      message: 'Please enter your departure date',
      success: false,
    });
  } else if (!req.body.driver.trim()) {
    res.status(401).send({
      message: 'Please enter your username',
      success: false,
    });
  } else if (!req.body.location.trim()) {
    res.status(401).send({
      message: 'Please enter your departure location',
      success: false,
    });
  } else if (!req.body.destination.trim()) {
    res.status(401).send({
      message: 'Please enter your destination',
      success: false,
    });
  } else if (!req.body.departure_time.trim()) {
    res.status(401).send({
      message: 'Please indicate your departure time',
      success: false,
    });
  } else {
    next();
  }
};

export default rideValidate;
