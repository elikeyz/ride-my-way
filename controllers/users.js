import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectString = 'postgres://postgres:mastahacka@localhost:5432/rides';
const pool = new Pool({
  connectionString: connectString,
});

const userController = {
  signUp: (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    try {
      pool.query(`
          INSERT INTO users(username, name, email, password) 
          VALUES (req.body.username, req.body.name, req.body.email, hashedPassword)`, (err, res) => {
        console.log(err, res);
        pool.end();
      });
    } catch (err) {
      throw err;
    }
    const token = jwt.sign({ id: req.body.id }, process.env.SECRET_KEY, { expiresIn: 86400 });

    res.status(201).send({ auth: true, accessToken: token });
  },
};

export default userController;
