import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();

const userController = {
  signUp: (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const text = 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [
      req.body.username.trim(),
      req.body.firstName.trim(),
      req.body.lastName.trim(),
      req.body.email.trim(),
      hashedPassword];

    dbconnect.query(text, values, (err, result) => {
      const userId = result.rows[0].id;
      const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: 86400 });
      res.status(201).send({
        message: 'User account created successfully',
        success: true,
        accessToken: token,
        user: result.rows[0],
      });
    });
  },

  login: (req, res) => {
    const userId = req.user.id;
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: 86400 });
    res.status(200).send({
      message: 'User logged in successfully',
      success: true,
      accessToken: token,
      user: req.user,
    });
  },
};

export default userController;
