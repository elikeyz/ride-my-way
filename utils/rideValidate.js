const rideValidate = (req, res, next) => {
  if (!req.body.date.trim()) {
    res.status(401).send({
      message: 'Please enter your departure date',
      success: false,
    });
  } else if (new Date() > new Date(req.body.date)) {
    res.status(401).send({
      message: 'Please enter a present or future date',
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
  } else if (!req.body.departureTime.trim()) {
    res.status(401).send({
      message: 'Please indicate your departure time',
      success: false,
    });
  } else {
    next();
  }
};

export default rideValidate;
