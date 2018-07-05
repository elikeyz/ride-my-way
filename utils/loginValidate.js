const loginValidate = (req, res, next) => {
  if (!req.body.username) {
    res.status(400).send({
      message: 'Please enter your username',
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

export default loginValidate;

