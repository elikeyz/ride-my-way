import jwt from 'jsonwebtoken';

const tokenValidate = (req, res, next) => {
  jwt.verify(req.headers.token, process.env.SECRET_KEY, (err) => {
    if (err) {
      res.status(401).send({
        message: 'Please log in',
        success: false,
      });
    } else {
      next();
    }
  });
};

export default tokenValidate;
