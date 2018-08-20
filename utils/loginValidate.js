const loginValidate = (req, res, next) => {
  if (!req.body.username.trim()) {
    res.status(400).send({
      message: 'Please enter your username',
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

export default loginValidate;

