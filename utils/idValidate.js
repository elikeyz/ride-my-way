const idValidate = (req, res, next) => {
  if (isNaN(req.params.id)) {
    res.status(400).send({
      message: 'Please enter a valid ID parameter',
      success: false,
    });
  } else {
    next();
  }
};

export default idValidate;
