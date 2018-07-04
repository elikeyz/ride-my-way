import jwt from 'jsonwebtoken';

const tokenValidate = (req, res, next) => {
  jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: 'Login Failed',
      });
    } else {
      console.log(decoded);
      next();
    }
  });
};

export default tokenValidate;
