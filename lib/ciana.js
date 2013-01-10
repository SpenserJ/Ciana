var conf = require('./config')
  , webapp = require('./webserver').webapp
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
  var self = this
    , connections = {}
    , providers = conf.get('providers');

  self.io = io.listen(webserver);
  self.io.sockets.on('connection', function(socket) {
    socket.emit('initialize', { hello: 'world' });
    sockethandler(socket, connections);
  });

  self.collectors = [];
  Object.keys(providers).forEach(function(provider_name) {
    var provider = providers[provider_name];
    switch (provider.type) {
      case 'collector':
        provider.next_run = provider.frequency;
        provider.name = provider_name;
        if (typeof provider.function === 'undefined') {
          provider.function = 'get';
        }
        var plugin = require('../plugins/collectors/' + provider.plugin);
        provider.plugin_module = new plugin();
        self.collectors.push(provider);
        break;

      default:
        console.log('Not sure what to do with provider type %s:\n', provider.type, provider);
    }
  });

  self.collector_timer = setInterval(function(ciana) {
    ciana.collectors.forEach(function(collector) {
      collector.next_run--;
      if (collector.next_run <= 0) {
        collector.next_run = collector.frequency;
        console.log('Running collector %s now.', collector.name);
        console.log(collector.plugin_module[collector.function].call());
      }
      console.log('Running collector %s in another %ds', collector.name, collector.next_run);
    });
    console.log("\n\n");
  }, 1000, self);

  console.log('Ciana started on port ' + conf.get('port'));
}

module.exports = Ciana;
