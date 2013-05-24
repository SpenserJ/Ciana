var fs = require('fs')
  , conf = require('./config')
  , chokidar = require('chokidar')
  , Layout = require('./layout').Layout;

var Screen = module.exports.Screen = function Screen(name) {
  console.log('lib/screen.js - Needs to watch screen config');
  console.log('lib/screen-js - Config loading is insecure');

  var self = this;
  self.name = name;
  self.config = require(conf.get('app_path') + '/screens/' + name + '.json');
  self.panels = (typeof self.config.panels === 'undefined') ? {} : self.config.panels;
  self.layout = new Layout('default');
  
  Object.keys(self.panels).forEach(function(panel_name) {
    self.panels[panel_name].name = panel_name;
  });
};
