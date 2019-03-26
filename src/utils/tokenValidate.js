import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenValidate = (req, res, next) => {
  jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: 'Please log in',
        success: false,
      });
    } else {
      req.userId = decoded.id;
      next();
    }
  });
};

export default tokenValidate;
