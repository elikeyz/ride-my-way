import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();

const userController = {
  signUp: (req, res) => {
    let text = 'SELECT * from users WHERE username = $1';
    let values = [req.body.username.trim()];

    dbconnect.query(text, values, (err, result) => {
      if (err) {
        res.status(500).send({
          message: 'Server Error!',
          success: false,
        });
        console.log(err);
      } else if (result.rowCount >= 1) {
        res.status(409).send({
          message: 'Username already exists',
          success: false,
        });
      } else {
        const hashedPassword = bcrypt.hashSync(req.body.password.trim(), 10);

        text = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
        values = [req.body.username.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim(), hashedPassword];

        dbconnect.query(text, values, (err, result) => {
          if (err) {
            res.status(500).send({
              message: 'Server Error!',
              success: false,
            });
            console.log(err);
          } else {
            const userId = result.rows[0].id;
            const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: 86400 });
            res.status(201).send({
              message: 'User account created successfully',
              success: true,
              accessToken: token,
            });
          }
        });
      }
    });
  },

  login: (req, res) => {
    const text = 'SELECT * FROM users WHERE username = $1';
    const values = [req.body.username.trim()];

    dbconnect.query(text, values, (err, result) => {
      if (err) {
        res.status(500).send({
          message: 'Server Error!',
          success: false,
        });
      } else if (result.rowCount < 1) {
        res.status(404).send({
          message: 'User account not found!',
          success: false,
        });
      } else {
        const comparePassword = bcrypt.compareSync(req.body.password.trim(), result.rows[0].password.trim());
        if (!comparePassword) {
          res.status(401).send({
            message: 'Wrong password!',
            success: false,
          });
        } else {
          const token = jwt.sign({ id: req.body.id }, process.env.SECRET_KEY, { expiresIn: 86400 });
          res.status(200).send({
            message: 'User logged in successfully',
            success: true,
            accessToken: token,
          });
        }
      }
    });
  },
};

export default userController;
