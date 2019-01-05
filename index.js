var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});  
connection = require('./connection.js');  
var bodyParser = require('body-parser');  

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// routing
//Home
app.get('/', function (req, res) {
	connection.query("SELECT * FROM records ORDER BY date DESC", function (err, rows, fields) {
    		if (err) throw err; 
    		 	
    		res.render('pages/index', { results:rows });  
  	});
 
});
//Get a record reading
//Note: Consider using a separate file to use cron tasks to execute this task
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
	connection.query("SELECT * FROM outages ORDER BY date DESC", function (err, rows, fields) {
    		if (err) throw err; 
    		res.render('pages/outages', { results:rows });
  	});
});

//Search Filter reports by days - between 
app.post('/filter-reports', function(req, res) {
	var start_date = req.body.start;
	var end_date = req.body.end;

 	if (start | end) { 
		connection.query("SELECT * FROM records WHERE (date BETWEEN '"+start+"' AND '"+end+"')", function (err, result) {
	    	if (err) throw err; 
        	console.log(result);
   		});
	} if (!(end)) {
		connection.query("SELECT * FROM records WHERE date '"+start+"'", function (err, result) {
	    	if (err) throw err; 
        	console.log(result);
   		});	

	} else {
		connection.query("SELECT * FROM records WHERE date '"+end+"'", function (err, result) {
	    	if (err) throw err; 
        	console.log(result);
   		});	
	}; 
});

//Search Filter outages by days - between
app.get('/filter-outages', function(req, res) {
	console.log("hello");
});
 

server.listen(3000); 