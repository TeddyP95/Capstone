// the pool class is a feature of the pg library that allows us to connect to the database and manages a pool of connections to the database. it is used to create a connection pool and execute queries. By keeping multiple connectsion open it imroves performance. 
import{config} from "dotenv";
import { Pool } from 'pg';
config();
const pool = new Pool({
  user: process.env.DB_USER || 'teddypillay',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB ||  'Capstone',
  password: process.env.DB_PASSWORD || 'PLACEHOLDER',
  port: process.env.PORT || 5432, 
  ssl:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
      ? { rejectUnauthorized: false }
      : undefined,
});

export default pool; 