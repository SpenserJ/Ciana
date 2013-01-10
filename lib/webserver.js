var conf = require('./config')
  , http = require('http')
  , express = require('express');

var app = exports.webapp = express()
  , server = exports.webserver = http.createServer(app);

app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
  res.render(__dirname + '/../public/index.html');
});

server.listen(conf.get('port'));
