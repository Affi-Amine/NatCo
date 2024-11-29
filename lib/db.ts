// lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PG_USER,        // Your PostgreSQL username
  host: process.env.PG_HOST,       // Database host, usually 'localhost'
  database: process.env.PG_DATABASE, // Your database name
  password: process.env.PG_PASSWORD, // Your PostgreSQL password
  port: Number(process.env.PG_PORT) || 5432, // PostgreSQL port (default: 5432)
});

export default pool;