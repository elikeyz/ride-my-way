import { Pool } from 'pg';

// const dbconnect = {
//   pool: new Pool({
//     connectionString: 'postgres://postgres:mastahacka@localhost:5432/rides',
//   }),
// };

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rides',
  password: 'mastahacka',
  port: 5432,
})

// const dbconnect = new Pool({
//   connectionString: 'postgres://postgres:mastahacka@localhost:5432/rides',
// })

export default pool;
