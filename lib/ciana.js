var webapp = require('./webserver').app
  , webserver = require('./webserver').webserver
  , sockethandler = require('./socket')
  , io = require('socket.io');

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

var Ciana = function() {
  this.webapp = webapp;
  this.webserver = webserver;
}

Ciana.prototype.start = function start() {
  var connections = {};

  this.io = io.listen(webserver);
  this.io.sockets.on('connection', function(socket) {
    socket.emit('initialize', { hello: 'world' });
    sockethandler(socket, connections);
  });

  console.log('Ciana started on port 3000');
}

module.exports = Ciana;
