// config/config.js
const mysql = require('mysql2');
// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'students',
});

// Export the promise-based connection pool
const promisePool = pool.promise();
module.exports = promisePool;

