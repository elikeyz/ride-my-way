import { Pool } from 'pg';

const dbconnect = {
  pool: new Pool({
    connectionString: 'postgres://postgres:mastahacka@localhost:5432/rides',
  }),
};

export default dbconnect;
