const mysql = require("mysql2/promise");
const { env } = require("../config/env").default;

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function verifyDatabaseConnection() {
  await pool.query("SELECT 1");
}

module.exports = { pool, verifyDatabaseConnection };
