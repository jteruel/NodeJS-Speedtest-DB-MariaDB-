var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
 
// routing
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/templates/index.html');
});

server.listen(3000); 