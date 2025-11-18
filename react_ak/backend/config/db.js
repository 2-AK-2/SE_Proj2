// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cabify",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
});

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 as ok");
    // console.log("✅ MySQL pool ready");
  } catch (err) {
    console.error("❌ MySQL connection test failed:", err);
    process.exit(1);
  }
}
testConnection();

export default pool;
