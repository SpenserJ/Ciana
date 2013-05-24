var conf = require('./config')
  , util = require('util');

var Provider = function Provider(name, config, sockets) {
  var ProviderModel = require('../providers/' + name).provider
    , provider = new ProviderModel(config);

  provider.super_(config, sockets);
  return provider;
};

module.exports = Provider;
