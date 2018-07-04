const loginValidate = (req, res, next) => {
  if (!req.body.username) {
    res.status(400).send('Please enter your username');
  } else if (!req.body.password) {
    res.status(400).send('Please enter your password');
  } else {
    next();
  }
};

export default loginValidate;

