import bcrypt from 'bcryptjs';
import dbconnect from '../dbconnect';

const verifyUserAccount = (req, res, next) => {
  const text = 'SELECT * FROM users WHERE username = $1';
  const values = [req.body.username.trim()];
  dbconnect.query(text, values, (err, result) => {
    if (result.rowCount < 1) {
      res.status(404).send({
        message: 'User account not found!',
        success: false,
      });
    } else {
      const comparePassword = bcrypt.compareSync(req.body.password, result.rows[0].password);
      if (!comparePassword) {
        res.status(401).send({
          message: 'Wrong password!',
          success: false,
        });
      } else {
        // eslint-disable-next-line prefer-destructuring
        req.user = result.rows[0];
        next();
      }
    }
  });
};

export default verifyUserAccount;
