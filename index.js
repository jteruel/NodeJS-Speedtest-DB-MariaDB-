var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});  
connection = require('./connection.js');

app.set('view engine', 'ejs');
// routing
//Home
app.get('/', function (req, res) {
	connection.connect(function(err) {
		if (err) throw err; 
		connection.query("SELECT * FROM records ORDER BY date DESC", function (err, rows, fields) {
    		if (err) throw err; 
    		 
    		res.render('pages/index', { results:rows }); 
  		});
    });  
});
//Get a record reading
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

//Get all outage reports
app.get('/outages', function(req, res) {
	connection.connect(function(err) {
		if (err) throw err; 
		connection.query("SELECT * FROM outages ORDER BY date DESC", function (err, rows, fields) {
    		if (err) throw err; 
    		res.render('pages/outages', { results:rows });
  		});
    });  
});

//Search Filter reports by days - between 
app.get('/filter-reports', function(req, res) {
	console.log("hello");
});

//Search Filter outages by days - between
app.get('/filter-outages', function(req, res) {
	console.log("hello");
});


server.listen(3000); 