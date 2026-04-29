import { createPool } from "mysql2/promise";
import env from "../config/env.js";

export const pool = createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function verifyDatabaseConnection() {
  await pool.query("SELECT 1");
}
