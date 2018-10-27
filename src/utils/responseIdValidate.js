const responseIdValidate = (req, res, next) => {
  if (Number.isNaN(Number(req.params.rideid))) {
    res.status(400).send({
      message: 'Please enter a valid Ride ID parameter',
      success: false,
    });
  } else if (Number.isNaN(Number(req.params.requestid))) {
    res.status(400).send({
      message: 'Please enter a valid Request ID parameter',
      success: false,
    });
  } else {
    next();
  }
};

export default responseIdValidate;

