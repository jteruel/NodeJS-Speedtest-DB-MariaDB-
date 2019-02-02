var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});  
var connection = require('./connection.js');  
var bodyParser = require('body-parser'); 
var session = require('express-session');
var moment = require('moment');

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({ 
	extended: true  
}));
app.use(bodyParser.json()); 

app.use(session({
  secret: 'keyboard cat',
  resave:true,
  resave: false,
  saveUninitialized: true, 
}));

//establish today
current_time =moment().format('YYYY-MM-DD'); 

// routing
//Home
app.get('/', function (req, res) {  
	if(req.session.status != 1) {
		res.redirect('/login');  
	}

	sql = "SELECT * FROM records ORDER BY date DESC";

	connection.query(sql).then((rows) => { 
          res.render('pages/index', { results:rows }); 
  	});
 
});

//RECORDS
//create record
app.get('/get-record', function (req, res) {
	if(req.session.status != 1) {
		res.redirect('/login');  
	}
	
	test.on('data', data => { 
	  	//variables    
		isp = data.client.isp;
		isp_server = data.server.sponsor;
		isp_client = data.client.isp; 
		upload = data.speeds.upload;
		download = data.speeds.download;  
	    //query
	    sql = "INSERT INTO records (isp, isp_server,isp_client,upload,download) VALUES ('" +isp +"','"+isp_server+"','"+isp_client+"','"+upload+"','"+download+"')"; 
    	connection.query(sql).then((rows) => { 
    		console.log("1 record inserted");
	    	//redirect to home
	    	res.redirect('/'); 
    	}); 
    }); 
});

//Search Filter reports by days - between 
app.post('/filter-reports', function(req, res) {
	if(req.session.status != 1) {
		res.redirect('/login');  
	}
	
	var start = req.body.start;
	var end = req.body.end;
 	//add to session data  
 	req.session.start = start; 
 	req.session.end = end;
    //redirect to home
	res.redirect('/search-records');  
 
});

//search records filter results page
app.get('/search-records', function (req, res) { 
	if(req.session.status != 1) {
		res.redirect('/login');  
	}
	
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

	connection.query(sql).then((rows) => { 
    	res.render('pages/search-records', { results:rows });  
  	});
 
});


//OUTAGES
//Get all outage reports
app.get('/outages', function(req, res) {
	if(req.session.status != 1) {
		res.redirect('/login');  
	}
	
	connection.query("SELECT * FROM outages ORDER BY date DESC").then((rows) => { 
    	res.render('pages/outages', { results:rows });
  	}); 
});

//Search Filter outages by days - between
app.post('/filter-outages', function(req, res) {
	if(req.session.status != 1) {
		res.redirect('/login');  
	}
	
	var start = req.body.start;
	var end = req.body.end;
 	//add to session data  
 	req.session.start = start; 
 	req.session.end = end;
    //redirect to home
	res.redirect('/search-outages');  
});

//Search filter outages results
app.get('/search-outages', function (req, res) { 
	if(req.session.status != 1) {
		res.redirect('/login');  
	}
	
	start = req.session.start;
	end = req.session.end;
	//if start and no end
    if (start && (!(end))) {
		sql = "SELECT * FROM outages WHERE date ='"+start+"' ORDER BY date DESC";
	} 
	//if end but no start
	if(end && (!(start))) {
		sql = "SELECT * FROM outages WHERE date ='"+end+"' ORDER BY date DESC";	
	} 
	//if both start and end
	if(start && end) {
		sql = "SELECT * FROM outages WHERE (date BETWEEN '"+start+"' AND '"+end+"') ORDER BY date DESC";
	};

	if( (!(start)) && (!(end))) {
		sql = "SELECT * FROM outages ORDER BY date DESC";
	};

	connection.query(sql).then((rows) => { 
    	res.render('pages/search-outages', { results:rows });  
  	});
 
});

//LOGIN
//login page
app.get('/login', function(req, res) {
	res.render('pages/login');
});

//signin
app.post('/verify-user', function(req, res) {
	username = req.body.username; 
	password = req.body.password;  
	sql = "SELECT * FROM users WHERE username ='"+username+"' AND password = '"+password+"'" ;

	connection.query(sql).then((rows) => { 
		if(rows.length==0) { 
			res.redirect('/login');  
		} else { 
			req.session.status = 1;
			res.redirect('/');  
		}
  	});
});
//logout
app.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/');  
});

server.listen(3000); 