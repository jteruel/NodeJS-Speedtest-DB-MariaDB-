var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
connection = require('./connection.js');
records = require('./apps/records.js');
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000}); 
// routing
app.get('/', function (req, res) {
	 res.send(records.records);
});

app.get('/get-record', function(req, res) {

	res.send(records.get_record);
	//return redirect to homepag

});
 

server.listen(3000); 