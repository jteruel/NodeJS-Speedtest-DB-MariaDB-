var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});
connection = require('../connection.js');

records = connection.connect(function( err) {
	if (err) throw err; 
	connection.query("SELECT * FROM records", function (err, result, fields) {
    	if (err) throw err;
    	console.log(result);
  	});
}); 

add_record =  test.on('data', data => { 
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
	});
});

module.exports = records;
module.exports = add_record;