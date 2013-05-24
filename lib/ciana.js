var conf = require('./config')
  , webapp = require('./webserver').webapp
  , webserver = require('./webserver').webserver
  , sockethandler = require('./socket')
  , io = require('socket.io')
  , Layout = require('./layout').Layout
  , Template = require('./layout').Template
  , Provider = require('./provider')
  , chokidar = require('chokidar');

process.on('uncaughtException', function(err) {
  console.trace('Caught exception: ' + err);
});

var layout = new Layout('default');

var Ciana = function() {
  this.webapp = webapp;
  this.webserver = webserver;
};

Ciana.prototype.start = function start() {
  var self = this
    , provider_conf = conf.get('providers');

  self.io = io.listen(webserver);
  self.io.set('log level', 1); // Reduce logging
  self.io.sockets.on('connection', function(socket) {
    var toTemplate = {};
    socket.emit('templates', layout.templates);
    socket.emit('panels', layout.panels);
    Object.keys(self.providers).forEach(function (provider_name) {
      if (typeof toTemplate[provider_name] !== 'undefined') {
        return;
      }
      var provider = require('../providers/' + provider_name).toTemplate
        , functions = {};
      Object.keys(provider).forEach(function (template) {
        functions[template] = provider[template].toString();
      });
      toTemplate[provider_name] = functions;
    });
    socket.emit('provider_to', toTemplate);
    sockethandler(socket);
  });
  layout.watch(function(file) {
    if (file === layout.path_server + '/index.html' ||
        file.match(/.*\.(css|less)/) !== null) {
      self.io.sockets.emit('reload');
    } else {
      var template = file.match(/panels\/(.*?)\.html/);
      if (template !== null) {
        layout.templates[template[1]] = new Template(layout, template[1]);
        var emit = {};
        emit[template[1]] = layout.templates[template[1]];
        self.io.sockets.emit('templates', emit);
      }
    }
  });

  var script_reloader = function() {
    self.io.sockets.emit('reload');
  };
  var watcher = chokidar.watch(
    [conf.get('app_path') + '/public/scripts', conf.get('app_path') + '/public/libraries'],
    { ignoreInitial: true, ignored: /\/\./ });
  watcher.on('add', script_reloader).on('change', script_reloader).on('unlink', script_reloader);

/*
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
        var plugin = require('../providers/collectors/' + provider.plugin);
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
        self.io.sockets.emit('provider', {
          name: collector.name,
          data: collector.plugin_module[collector.function].call()
        });
      }
      //console.log('Running collector %s in another %ds', collector.name, collector.next_run);
    });
  }, 1000, self);
*/

  self.providers = {};
  Object.keys(provider_conf).forEach(function(provider_name) {
    var ProviderModel = require('../providers/' + provider_name).provider
      , provider = new ProviderModel(provider_conf[provider_name]);
    provider.sockets = self.io.sockets;
    self.providers[provider_name] = provider;
    self.providers[provider_name].start();
  });

  console.log('Ciana started on port ' + conf.get('port'));
};

module.exports = Ciana;
