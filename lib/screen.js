var fs = require('fs')
  , conf = require('./config')
  , chokidar = require('chokidar')
  , Layout = require('./layout').Layout
  , Template = require('./layout').Template
  , Utilities = require('./utilities');

var Screen = module.exports.Screen = function Screen(ciana, name) {
  console.log('lib/screen.js - Needs to watch screen config');
  console.log('lib/screen-js - Config loading is insecure');

  var self = this;
  self.name = name;
  self.config = require(conf.get('app_path') + '/screens/' + name + '.json');
  self.panels = (typeof self.config.panels === 'undefined') ? {} : self.config.panels;
  self.layout = new Layout('default');
  self.providers = {};
  self.provider_mixins = {};
  
  var i, panel_list = Object.keys(self.panels), panel_name, panel, provider_name, provider_settings, i2;
  for (i = 0; i < panel_list.length; i++) {
    panel_name = panel_list[i];
    panel = self.panels[panel_name];
    panel.name = panel_name;

    self.layout.loadTemplate(panel.template);

    provider_name = panel.provider + '-' + panel_name;
    provider_settings = (typeof panel.settings !== 'undefined') ? panel.settings : {};
    provider_settings.panel_name = panel_name;
    var ProviderModel = require('../providers/' + panel.provider).Server
      , PanelMixin = require('../providers/' + panel.provider).Client
      , provider = new ProviderModel(provider_settings);
    provider.sockets = ciana.io.sockets;
    ciana.providers[provider_name] = provider;
    self.providers[provider_name] = provider;

    self.provider_mixins[provider.name] = Utilities.recursiveStringifyFunctions(PanelMixin);
 
    provider.start();
  }
};

