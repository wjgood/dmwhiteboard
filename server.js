
const PORT = process.env.PORT || 3000;

var fs = require('fs');
var path = require('path');
var express = require('express');

// Set up server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Routing
app.get('/log', getLogs);
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, function () {
  console.log('Server listening at port %d.', PORT);
});

var activeConnections = 0;
var currentLog = [];

// Cliet comms
io.on('connection', function(socket) {
  activeConnections++;
  //io.emit('test', 'hi2');
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  var name = socketId +" (" +clientIp+")";

  console.log('User connected: ' + name);


  socket.on('disconnect', function() {
    activeConnections--;
    console.log('User disconnected: ' + name);
  });

  socket.on('test', function(message) {
    console.log("Message from user " + name +": "+ message);
  });

  socket.on('log', function(message) {
    console.log("Log from User " + name +": ");
    console.log(message);
    currentLog.push({user: name, log: message});
  });
});


function getLogs(req, res) {
  res.header('Content-Disposition', "filename=log.json");
  res.header("Content-Type", "text/plain");
  res.statusCode = 200;
  res.send(JSON.stringify(currentLog));
}
