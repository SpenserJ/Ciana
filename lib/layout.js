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
    if (typeof self.templates[panel.type] === 'undefined') {
      self.templates[panel.type] = new Template(self, panel.type);
      console.log(self.templates[panel.type]);
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
  self.watcher = chokidar.watch(self.path_server, { ignoreInitial: true });
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
  layout_conf.scripts.push('/layouts/default/panels/' + panel.type + '.js')
  */
};
