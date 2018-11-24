//import library
var fs      = require("fs");
var express = require("express");
var app     = express();
var server  = require("http").Server(app); // use web socket
var io      = require("socket.io").listen(server);
//--------------------------------------------------------
var mysql = require('mysql');
var connection=mysql.createConnection({
	host	: '127.0.0.1',
	user	: 'root',
	password: 'root',
	database :'table_test',
	insecureAuth:true
});


app.use(express.static(__dirname + '/Python')); // Python contain all static files 
server.listen(3000);
console.log("Server - Waiting connection at port: 3000");


var roles = {
  sender  : "",
  receiver    : ""  
};
io.sockets.on('connection', function (socket) { // connection event
  socket.on('setRole', function (data) {
    socket.role = data.trim();
    roles[socket.role] = socket.id;
    console.log("Role "+ socket.role + " is connected.");    
  }); 

  socket.on("sendPhoto", function(data){ 	// sendPhoto event
    var guess = data.base64.match(/^data:image\/(png|jpeg);base64,/)[1];
    var ext = "";
    switch(guess) {		// matching with suffix
      case "png"  : ext = ".png"; break;
      case "jpeg" : ext = ".jpg"; break;
      default     : ext = ".bin"; break;
    }
    var savedFilename ="/Python36/"+"image"+ext;
    fs.writeFile(__dirname+"/Python"+savedFilename, getBase64Image(data.base64), 'base64', function(err) {
      if (err !== null)
        console.log(err);
      else 
        io.to(roles.receiver).emit("receivePhoto", { //execute receivePhoto event
          path: savedFilename,
        });
        console.log("Send photo success!");
    });
  });
  ////////////////////////////////////
  setTimeout(function(){
		console.log('processing');
	},3000);

	truy_xuat();

///////////////////////////////////////
  socket.on('disconnect', function() { // disconnect event
    console.log("Role " + socket.role + " is disconnect.");
  }); 
});

/*function randomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}*/

function getBase64Image(imgData) { // convert encode base64 
    return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
}
// query  data from MySQL 

function truy_xuat(){
	connection.connect(function (err){
		if (err) {
			console.log('error '+err.message);
			//throw err;
		} else {
			console.log('connect to mysql successfully');
		}
		var sql ='select fin from object';
		connection.query(sql, function (err, results, fields){
			//if (err) throw err;
			//console.log(results[0].fin);
			Object.keys(results).forEach(function(key) {
			row = results[key].fin;
			io.sockets.on('connection', function (socket) {
				socket.emit("getUrl",row);
				console.log(row);
				});
			});
		});	
	});	
}