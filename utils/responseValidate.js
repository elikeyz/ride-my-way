const responseValidate = (req, res, next) => {
  if (req.body.accept !== 'true' && req.body.accept !== 'false') {
    res.status(400).send('Please enter true or false');
  } else {
    next();
  }
};

export default responseValidate;

