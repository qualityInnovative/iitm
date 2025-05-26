const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Define a helper function to wrap pool.query in a Promise
const query = (sql, values, user) => {
  const logSql = "INSERT INTO logs (user, tble, operation) VALUES (?, ?, ?)";
  let operation = "";
  let table = "";

  // Parse the SQL query to extract operation type and table name
  if (sql.toLowerCase().startsWith("insert")) {
    operation = "insert";
    table = sql
      .substring(
        sql.toLowerCase().indexOf("into") + 5,
        sql.toLowerCase().indexOf("(")
      )
      .trim();
  } else if (sql.toLowerCase().startsWith("update")) {
    operation = "update";
    table = sql
      .substring(
        sql.toLowerCase().indexOf("update") + 6,
        sql.toLowerCase().indexOf("set")
      )
      .trim();
  } else if (sql.toLowerCase().startsWith("delete")) {
    operation = "delete";
    const fromIndex = sql.toLowerCase().indexOf("from") + 4;
    const whereIndex = sql.toLowerCase().indexOf("where");
    table =
      whereIndex !== -1
        ? sql.substring(fromIndex, whereIndex).trim()
        : sql.substring(fromIndex).trim();
  }

  // Check if user is provided and the operation is insert, update, or delete
  if (user && ["insert", "update", "delete"].includes(operation)) {
    const logValues = [user, table, operation];
    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          pool.query(logSql, logValues, (logErr, logResult) => {
            if (logErr) {
              console.error("Error logging:", logErr);
            }
            resolve(result);
          });
        }
      });
    });
  } else {
    // Return a promise that resolves immediately without logging
    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
};

module.exports = query;
