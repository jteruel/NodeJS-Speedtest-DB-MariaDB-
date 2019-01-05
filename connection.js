var mysql = require('mysql');
//get variables from database.json
var db = require('./database.json');

connection = mysql.createConnection({
		connectionLimit :10,
	  	host: db.dev.host,
	  	user: db.dev.user,
	  	password: db.dev.password,
	  	database: db.dev.database,
	  	port: db.dev.port,
	});

module.exports = connection;