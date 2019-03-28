import dbconnect from '../dbconnect';

const verifyNewUser = (req, res, next) => {
  const text = 'SELECT * from users WHERE username = $1';
  const values = [req.body.username.trim()];

  dbconnect.query(text, values, (err, result) => {
    if (result.rowCount >= 1) {
      res.status(409).send({
        message: 'Username already exists',
        success: false,
      });
    } else {
      next();
    }
  });
};

export default verifyNewUser;
