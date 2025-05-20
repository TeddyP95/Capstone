// the pool class is a feature of the pg library that allows us to connect to the database and manages a pool of connections to the database. it is used to create a connection pool and execute queries. By keeping multiple connectsion open it imroves performance. 
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Capstone',
  password: 'PLACEHOLDER',
  port: 5432,
});

export default pool; 