// Import and require mysql2
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: '', // add password to database
   database: 'jv_employees_db'
 });
 
module.exports = connection;
