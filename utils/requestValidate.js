const requestValidate = (req, res, next) => {
  if (!req.body.passenger.trim()) {
    res.status(400).send({
      message: 'Please enter your username',
      success: false,
    });
  } else {
    next();
  }
};

export default requestValidate;

