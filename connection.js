var mariadb = require('mariadb');
//get variables from database.json
var db = require('./database.json');

connection = mariadb.createPool({
		connectionLimit :10,
	  	host: db.dev.host,
	  	user: db.dev.user,
	  	password: db.dev.password,
	  	database: db.dev.database,
	  	port: db.dev.port,
	});

module.exports = connection;