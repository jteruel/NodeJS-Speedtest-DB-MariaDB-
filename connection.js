var mysql = require('mysql');
//get variables from database.json
var db = require('./database.json');

connection = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "speedtest_synology",
	  port: "3306",
	});

module.exports = connection;