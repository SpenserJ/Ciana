var conf = require('./config')
  , http = require('http')
  , express = require('express')
  , lessMiddleware = require('less-middleware');

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
  res.render(conf.get('app_path') + '/public/layouts/default/index.jade');
});

server.listen(conf.get('port'));
