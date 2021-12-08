// get the client
const mysql = require('mysql2');

//create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
});

// handle connection errors
connection.connect(function (err) {
    if(err) throw err;
});

//export the connection for use in the query file
module.exports = connection;