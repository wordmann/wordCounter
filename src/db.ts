import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'wordcounter',
  password: 'password',
  port: 5432,
});

export default pool;
