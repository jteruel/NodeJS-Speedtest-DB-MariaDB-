var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app); 
connection = require('./connection.js');

// routing
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/templates/index.html');
});

connection.connect(function(err) {
    if (err) {
        console.error('Error:- ' + err.stack);
        return;
    }
     
    console.log('Connected Id:- ' + connection.threadId);
});

server.listen(3000); 