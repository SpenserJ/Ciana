var fs = require('fs')
  , conf = require('./config');

var Layout = module.exports = function(name) {
  var self = this;
  self.path_client = '/layouts/' + name;
  self.path_server = conf.get('app_path') + '/public' + self.path_client;
  self.templates = {};
  layout_conf = require(self.path_server + '/config.json');
  if (typeof layout_conf.panels === 'undefined') {
    layout_conf.panels = {};
  }
  /*
  if (typeof layout_conf.scripts === 'undefined') {
    layout_conf.scripts = [];
  }
  if (layout_conf.libraries instanceof Array === true) {
    layout_conf.libraries.forEach(function(library) {
      layout_conf.scripts.push('/public/libraries/' + library);
    });
  }
  */
  Object.keys(layout_conf.panels).forEach(function(panel_name) {
    var panel = layout_conf.panels[panel_name];
    if (typeof self.templates[panel.type] !== 'undefined') {
      return;
    }
    panel.name = panel_name;
    panel.filename = self.path_server + '/panels/' + panel.type + '.html';
    panel.content = fs.readFileSync(panel.filename, 'utf8');
    /*
    if (panel.libraries instanceof Array === true) {
      panel.libraries.forEach(function(library) {
        layout_conf.scripts.push('/libraries/' + library)
      });
    }
    layout_conf.scripts.push('/layouts/default/panels/' + panel.type + '.js')
    */
    self.templates[panel.type] = panel.content;
  });
  /*
  layout_conf.scripts = layout_conf.scripts.filter(function(elem, pos) {
    return layout_conf.scripts.indexOf(elem) == pos;
  });
  layout_conf.renderers = 'var panels = ' + JSON.stringify(layout_conf);
  */
}
