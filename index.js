var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});  
var connection = require('./connection.js');  
var bodyParser = require('body-parser'); 
var session = require('express-session')

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.use(session({
  secret: 'keyboard cat',
  resave:true,
  resave: false,
  saveUninitialized: true, 
}));

// routing
//Home
app.get('/', function (req, res) { 

	sql = "SELECT * FROM records ORDER BY date DESC";

	connection.query(sql, function (err, rows, fields) {
    	if (err) throw err; 
    	res.render('pages/index', { results:rows });  
  	});
 
});

//Records
app.get('/search-records', function (req, res) { 

	start = req.session.start;
	end = req.session.end;
	//if start and no end
    if (start && (!(end))) {
		sql = "SELECT * FROM records WHERE date ='"+start+"' ORDER BY date DESC";
	} 
	//if end but no start
	if(end && (!(start))) {
		sql = "SELECT * FROM records WHERE date ='"+end+"' ORDER BY date DESC";	
	} 
	//if both start and end
	if(start && end) {
		sql = "SELECT * FROM records WHERE (date BETWEEN '"+start+"' AND '"+end+"') ORDER BY date DESC";
	};

	if( (!(start)) && (!(end))) {
		sql = "SELECT * FROM records ORDER BY date DESC";
	};

	

	connection.query(sql, function (err, rows, fields) {
    	if (err) throw err; 
    	res.render('pages/search-records', { results:rows });  
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
	var start = req.body.start;
	var end = req.body.end;
 	//add to session data  
 	req.session.start = start; 
 	req.session.end = end;
    //redirect to home
	res.redirect('/search-records');  
 
});

//Search Filter outages by days - between
app.get('/filter-outages', function(req, res) {
	console.log("hello");
});

//LOGIN MATCH


//LOGOUT



server.listen(3000); 