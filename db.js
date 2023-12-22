const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12672291",
  password: "ujAUGKLrX7",
  database: "sql12672291",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;
