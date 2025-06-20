const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,         // mysql.railway.internal
  user: process.env.DB_USER,         // root
  password: process.env.DB_PASS,     // your password
  database: process.env.DB_NAME,     // railway
  port: process.env.DB_PORT          // 3306
});

connection.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.message);
    throw err;
  }
  console.log("✅ Connected to DB");
});

module.exports = connection;
