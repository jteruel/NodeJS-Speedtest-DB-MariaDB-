var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
connection = require('./connection.js');
var records = require('./apps/records.js');
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000}); 

app.set('view engine', 'ejs');
// routing
app.get('/', function (req, res, records) {
	console.log(records.records);
	//res.render('pages/index', records.records);
});

app.get('/get-record', function(req, res) {

	//

});
 

server.listen(3000); 