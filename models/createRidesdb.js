import { Pool } from 'pg';

const connectString = 'postgres://postgres:mastahacka@localhost:5432/rides';
const pool = new Pool({
  connectionString: connectString,
});

try {
  pool.query('CREATE TABLE IF NOT EXISTS rides(id SERIAL PRIMARY KEY, date DATE, driver TEXT, location TEXT, destination TEXT, departure_time TIME)', (err, res) => {
    console.log(err, res);
    pool.end();
  });
} catch (err) {
  throw err;
}
