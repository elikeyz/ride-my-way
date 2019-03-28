import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dbconnect from '../dbconnect';

dotenv.config();

const tokenValidate = (req, res, next) => {
  jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: 'Please log in',
        success: false,
      });
    } else {
      const text = 'SELECT * FROM users WHERE id = $1';
      const values = [decoded.id];
      dbconnect.query(text, values).then((result) => {
        // eslint-disable-next-line prefer-destructuring
        req.user = result.rows[0];
        next();
      });
    }
  });
};

export default tokenValidate;
