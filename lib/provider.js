var conf = require('./config')
  , util = require('util');

var Provider = function Provider(name, config, sockets) {
  var PluginModel = require('../plugins/' + name).plugin
    , plugin = new PluginModel(config);

  plugin.super_(config, sockets);
  return plugin;
}

module.exports = Provider;
