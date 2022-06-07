 //connect to mysql 
const mysql = require('mysql2');

const connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: 'Rootroot', // add password to database
   database: 'jv_employees_db'
 });
 
module.exports = connection;