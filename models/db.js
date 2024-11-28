const mysql = require('mysql');

// Database connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "IMS",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

module.exports = db;
