const requestValidate = (req, res, next) => {
  if (!req.body.passenger) {
    res.status(400).send('Please enter your username');
  } else {
    next();
  }
};

export default requestValidate;

