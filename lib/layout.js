var fs = require('fs')
  , conf = require('./config')
  , chokidar = require('chokidar');

var Layout = module.exports.Layout = function Layout(name) {
  var self = this;
  self.path_client = '/layouts/' + name;
  self.path_server = conf.get('app_path') + '/public' + self.path_client;
  self.templates = {};
  self.watcher = null;
  layout_conf = require(self.path_server + '/config.json');
  self.panels = (typeof layout_conf.panels === 'undefined') ? {} : layout_conf.panels;
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
  Object.keys(self.panels).forEach(function(panel_name) {
    self.panels[panel_name].name = panel_name;
    var panel = self.panels[panel_name];
    if (typeof self.templates[panel.template] === 'undefined') {
      self.templates[panel.template] = new Template(self, panel.template);
      console.log(self.templates[panel.template]);
    }
  });
  /*
  layout_conf.scripts = layout_conf.scripts.filter(function(elem, pos) {
    return layout_conf.scripts.indexOf(elem) == pos;
  });
  layout_conf.renderers = 'var panels = ' + JSON.stringify(layout_conf);
  */
}

Layout.prototype.watch = function watch(callback) {
  var self = this;
  self.watcher = chokidar.watch(self.path_server, { ignoreInitial: true, ignored: /\/\./ });
  self.watcher.on('add', callback).on('change', callback).on('unlink', callback);
};

var Template = module.exports.Template = function Template(layout, template) {
  this.name = template 
  this.filename = layout.path_server + '/panels/' + this.name + '.html'
  this.html = fs.readFileSync(this.filename, 'utf8');
  /*
  if (panel.libraries instanceof Array === true) {
    panel.libraries.forEach(function(library) {
      layout_conf.scripts.push('/libraries/' + library)
    });
  }
  layout_conf.scripts.push('/layouts/default/panels/' + panel.template + '.js')
  */
};
