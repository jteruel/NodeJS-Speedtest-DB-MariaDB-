var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});  
connection = require('./connection.js');

app.set('view engine', 'ejs');
// routing
app.get('/', function (req, res) {
	connection.connect(function(err) {
		if (err) throw err; 
		connection.query("SELECT * FROM records ORDER BY date DESC", function (err, rows, fields) {
    		if (err) throw err; 
    		res.render('pages/index', { results:rows });
  		});
    });  
});

app.get('/get-record', function(req, res) {

	test.on('data', data => { 
  	//variables    
	isp = data.client.isp;
	isp_server = data.server.sponsor;
	isp_client = data.client.isp; 
	upload = data.speeds.upload;
	download = data.speeds.download;  
	//input to database
	sql = "INSERT INTO records (isp, isp_server,isp_client,upload,download) VALUES ('" +isp +"','"+isp_server+"','"+isp_client+"','"+upload+"','"+download+"')"; 
		connection.query(sql, function (err, result) {
			if (err) throw err;
	    	console.log("1 record inserted");

	    	//redirect to home
	    	res.redirect('/');
		});
	});
});
 

server.listen(3000); 