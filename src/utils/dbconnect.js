import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let config = {};

if (process.env.NODE_ENV === 'test') {
  config = {
    connectionString: process.env.TEST_DATABASE_URL,
    ssl: true,
  };
} else {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  };
}

const pool = new Pool(config);
export default pool;
