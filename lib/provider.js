var conf = require('./config')
  , util = require('util');

var Provider = function Provider(name, config) {
  var PluginModel = require('../plugins/' + name)
    , plugin = new PluginModel(config);

  plugin.super_(config);
  return plugin;
}

module.exports = Provider;
