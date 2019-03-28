const validate = (req, res, next) => {
  if (!req.body.firstName.trim()) {
    res.status(400).send({
      message: 'Please enter your first name',
      success: false,
    });
  } else if (!req.body.lastName.trim()) {
    res.status(400).send({
      message: 'Please enter your last name',
      success: false,
    });
  } else if (!req.body.email.trim()) {
    res.status(400).send({
      message: 'Please enter your email',
      success: false,
    });
  } else {
    next();
  }
};

export default validate;
