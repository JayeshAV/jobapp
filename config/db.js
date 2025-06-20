const mysql = require('mysql2');
const dotenv = require('dotenv');
const { URL } = require('url');

dotenv.config();

const dbUrl = process.env.MYSQL_URL;

if (!dbUrl) {
  throw new Error('MYSQL_URL is not defined in environment variables');
}

const parsed = new URL(dbUrl);

const db = mysql.createConnection({
  host: parsed.hostname,
  user: parsed.username,
  password: parsed.password,
  database: parsed.pathname.replace('/', ''),
  port: parsed.port,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
  console.log('✅ DB connected to Railway MySQL');
});

module.exports = db;
