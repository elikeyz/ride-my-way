const validate = (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send('Please enter your name');
  } else if (!req.body.username) {
    res.status(400).send('Please enter your username');
  } else if (!req.body.email) {
    res.status(400).send('Please enter your email');
  } else if (!req.body.password) {
    res.status(400).send('Please enter your password');
  } else {
    next();
  }
};

export default validate;
