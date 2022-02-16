const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      port: 3001,
      // Your MySQL username,
      user: 'admin',
      // Your MySQL password
      password: 'testpasswordforproject',
      database: 'employee_tracker'
    },
    console.log('Connected to the database.')
);

module.exports = db;