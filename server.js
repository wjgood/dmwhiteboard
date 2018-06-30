
const PORT = process.env.PORT || 3000;

var fs = require('fs');
var path = require('path');
var express = require('express');

// Set up server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Routing
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, function () {
  console.log('Server listening at port %d.', PORT);
});
