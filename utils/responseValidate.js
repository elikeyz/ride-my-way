const responseValidate = (req, res, next) => {
  if (req.body.accept !== 'true' && req.body.accept !== 'false') {
    res.status(400).send({
      message: 'Please enter true or false',
      success: false,
    });
  } else {
    next();
  }
};

export default responseValidate;
