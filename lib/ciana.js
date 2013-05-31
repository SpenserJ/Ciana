var conf = require('./config')
  , webapp = require('./webserver').webapp
  , webserver = require('./webserver').webserver
  , sockethandler = require('./socket')
  , io = require('socket.io')
  , Screen = require('./screen').Screen
  , Provider = require('./provider')
  , chokidar = require('chokidar');

process.on('uncaughtException', function(err) {
  console.trace('Caught exception: ' + err);
});

var screen = new Screen('default');

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
    socket.emit('templates', screen.layout.templates);
    socket.emit('panels', screen.panels);
    Object.keys(self.providers).forEach(function (provider_name) {
      var provider = self.providers[provider_name]
        , functions = {}, templates = {};
      if (typeof toTemplate[provider.name] !== 'undefined') {
        return;
      }
      templates = provider.toTemplate;
      Object.keys(templates).forEach(function (template) {
        functions[template] = templates[template].toString();
      });
      toTemplate[provider.name] = functions;
    });
    socket.emit('provider_to', toTemplate);
    Object.keys(self.providers).forEach(function (provider_name) {
      self.providers[provider_name].reemit_last(socket);
    });
    sockethandler(socket);
  });
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

  var script_reloader = function() {
    self.io.sockets.emit('reload');
  };
  var watcher = chokidar.watch(
    [conf.get('app_path') + '/public/scripts', conf.get('app_path') + '/public/libraries'],
    { ignoreInitial: true, ignored: /\/\./ });
  watcher.on('add', script_reloader).on('change', script_reloader).on('unlink', script_reloader);

  self.providers = {};
  Object.keys(screen.panels).forEach(function(panel_name) {
    var panel = screen.panels[panel_name]
      , provider_name = panel.provider + '-' + panel_name
      , provider_settings = (typeof panel.settings !== 'undefined' ? panel.settings : {});
    provider_settings.panel_name = panel_name;
    var ProviderModel = require('../providers/' + panel.provider)
      , provider = new ProviderModel(provider_settings);
    provider.sockets = self.io.sockets;
    self.providers[provider_name] = provider;
    self.providers[provider_name].start();
  });

  console.log('Ciana started on port ' + conf.get('port'));
};

module.exports = Ciana;
