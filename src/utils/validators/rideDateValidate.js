const rideDateValidate = (req, res, next) => {
  if (new Date() > new Date(req.body.date)) {
    res.status(400).send({
      message: 'Please enter a present or future date',
      success: false,
    });
  } else {
    next();
  }
};

export default rideDateValidate;
