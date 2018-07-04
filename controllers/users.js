import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();

const userController = {
  signUp: (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const text = 'INSERT INTO users(username, name, email, password) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [req.body.username, req.body.name, req.body.email, hashedPassword];

    try {
      dbconnect.query(text, values, (err, res) => {
        console.log(err, res);
      });
    } catch (err) {
      throw err;
    }
    const token = jwt.sign({ id: req.body.id }, process.env.SECRET_KEY, { expiresIn: 86400 });

    res.status(201).send({ auth: true, accessToken: token });
  },

  login: (req, res) => {
    const text = 'SELECT * FROM users WHERE username = $1';
    const values = [req.body.username];

    dbconnect.query(text, values, (err, result) => {
      if (err) {
        res.status(500).send('Server Error!');
      } else if (result.rowCount < 1) {
        res.status(404).send('User account not found!');
      } else {
        const comparePassword = bcrypt.compareSync(req.body.password, result.rows[0].password);
        if (!comparePassword) {
          res.status(401).send('Wrong password!');
        } else {
          const token = jwt.sign({ id: req.body.id }, process.env.SECRET_KEY, { expiresIn: 86400 });
          res.status(200).send({ user: result.rows[0], accessToken: token });
        }
      }
    });
  },
};

export default userController;
