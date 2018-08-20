const validate = (req, res, next) => {
  if (!req.body.name.trim()) {
    res.status(400).send({
      message: 'Please enter your name',
      success: false,
    });
  } else if (!req.body.username.trim()) {
    res.status(400).send({
      message: 'Please enter your username',
      success: false,
    });
  } else if (!req.body.email.trim()) {
    res.status(400).send({
      message: 'Please enter your email',
      success: false,
    });
  } else if (!req.body.password.trim()) {
    res.status(400).send({
      message: 'Please enter your password',
      success: false,
    });
  } else {
    next();
  }
};

export default validate;
