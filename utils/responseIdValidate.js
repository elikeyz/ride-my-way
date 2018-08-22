const responseIdValidate = (req, res, next) => {
  if (isNaN(req.params.rideid)) {
    res.status(400).send({
      message: 'Please enter a valid Ride ID parameter',
      success: false,
    });
  } else if (isNaN(req.params.requestid)) {
    res.status(400).send({
      message: 'Please enter a valid Request ID parameter',
      success: false,
    });
  } else {
    next();
  }
};

export default responseIdValidate;

