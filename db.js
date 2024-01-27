const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10000,
  host: "sql12.freesqldatabase.com",
  user: "sql12679856",
  password: "6EpJvvzRHf",
  database: "sql12679856",
  waitForConnections: true,
  queueLimit: 0,
});

const connection = pool.promise();

module.exports = connection;