const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_complete",
  password: "123456Sa",
  port: 3307,
});

module.exports = pool.promise();
