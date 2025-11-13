// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",   // ❗ FIXED
    database: process.env.DB_NAME || "cabify",
  });

  console.log("✅ Connected to MySQL Database");
} catch (err) {
  console.error("❌ MySQL Connection Failed:", err.message);
  process.exit(1);
}

export default db;
