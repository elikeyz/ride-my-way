import { Pool } from 'pg';

const connectString = 'postgres://postgres:mastahacka@localhost:5432/rides';
const pool = new Pool({
  connectionString: connectString,
});

try {
  pool.query(`
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    email TEXT,
    password VARCHAR
  );
  CREATE TABLE IF NOT EXISTS rides(
    id SERIAL PRIMARY KEY,
    date DATE,
    driver TEXT REFERENCES users(username),
    location TEXT,
    destination TEXT,
    departure_time TIME
  );
  CREATE TABLE IF NOT EXISTS requests(
    id SERIAL PRIMARY KEY,
    passenger TEXT REFERENCES users(username),
    rideId INTEGER REFERENCES rides(id),
    isAccepted BOOLEAN
  )`, (err, res) => {
    console.log(err, res);
    pool.end();
  });
} catch (err) {
  throw err;
}
