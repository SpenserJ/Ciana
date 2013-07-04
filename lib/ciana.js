var conf = require('./config')
  , webapp = require('./webserver').webapp
  , webserver = require('./webserver').webserver
  , sockethandler = require('./socket')
  , io = require('socket.io')
  , Screen = require('./screen').Screen
  , chokidar = require('chokidar');

process.on('uncaughtException', function(err) {
  console.trace('Caught exception: ' + err);
});

var Ciana = function() {
  this.webapp = webapp;
  this.webserver = webserver;
};

Ciana.prototype.start = function start() {
  var self = this
    , provider_conf = conf.get('providers');

  self.screens = {};
  self.providers = {};

  self.io = io.listen(webserver);
  self.io.set('log level', 1); // Reduce logging

  self.io.sockets.on('connection', function(socket) { self.handleConnection(socket); });

  /*
  screen.layout.watch(function(file) {
    if (file === screen.layout.path_server + '/index.html' ||
        file.match(/.*\.(css|less)/) !== null) {
      self.io.sockets.emit('reload');
    } else {
      var template = file.match(/panels\/(.*?)\.html/);
      if (template !== null) {
        screen.layout.templates[template[1]] = new Template(screen.layout, template[1]);
        var emit = {};
        emit[template[1]] = screen.layout.templates[template[1]];
        self.io.sockets.emit('templates', emit);
      }
    }
  });
  */

  self.watchPublicForChanges();

  console.log('Ciana started on port ' + conf.get('port'));
};

Ciana.prototype.handleConnection = function handleConnection(socket) {
  sockethandler(this, socket);
};

Ciana.prototype.reloadClient = function reloadClient(socket) {
  if (typeof socket === 'undefined') {
    this.io.sockets.emit('reload');
  } else {
    socket.emit('reload');
  }
};

Ciana.prototype.watchPublicForChanges = function watchPublicForChanges() {
  var self = this
    , reload = function() { self.reloadClient(); };
  chokidar.watch(
    [conf.get('app_path') + '/public/scripts', conf.get('app_path') + '/public/libraries'],
    { ignoreInitial: true, ignored: /\/\./ }
  ).on('add',    reload)
   .on('change', reload)
   .on('unlink', reload);
};

module.exports = Ciana;
