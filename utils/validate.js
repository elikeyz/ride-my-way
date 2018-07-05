const validate = (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Please enter your name',
      success: false,
    });
  } else if (!req.body.username) {
    res.status(400).send({
      message: 'Please enter your username',
      success: false,
    });
  } else if (!req.body.email) {
    res.status(400).send({
      message: 'Please enter your email',
      success: false,
    });
  } else if (!req.body.password) {
    res.status(400).send({
      message: 'Please enter your password',
      success: false,
    });
  } else {
    next();
  }
};

export default validate;
