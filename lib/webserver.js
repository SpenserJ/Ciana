var http = require('http')
  , express = require('express');

var app = exports.webapp = express()
  , server = exports.webserver = http.createServer(app);

app.get('/', function(req, res) {
  res.send('Hello world');
});

server.listen(3000);
