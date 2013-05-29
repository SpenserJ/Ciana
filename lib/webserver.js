var conf = require('./config')
  , http = require('http')
  , express = require('express')
  , lessMiddleware = require('less-middleware')
  , fs = require('fs')
  , Layout = require('./layout').Layout
  , Template = require('./layout').Template;

var layout = new Layout('default');

var app = exports.webapp = express()
  , server = exports.webserver = http.createServer(app);

app.configure(function() {
  app.engine('html', require('ejs').renderFile);

  app.use(lessMiddleware({
    src: conf.get('app_path') + '/public',
    compress: true
  }));

  app.use(express.static(conf.get('app_path') + '/public'));
});

app.get('/', function(req, res) {
  fs.readFile(layout.path_server + '/index.html', 'utf8', function(err, data) {
    if (err) { throw err; }
    res.send(data);
  });
});

server.listen(conf.get('port'));
