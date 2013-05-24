var fs = require('fs')
  , conf = require('./config')
  , chokidar = require('chokidar');

var Layout = module.exports.Layout = function Layout(name) {
  var self = this
    , files, i;
  self.path_client = '/layouts/' + name;
  self.path_server = conf.get('app_path') + '/public' + self.path_client;
  self.templates = { panel: new Template(self, 'panel') };
  self.watcher = null;
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

  files = fs.readdirSync(self.path_server + '/panels');
  for(i = 0; i < files.length; i++) {
    var filename = /(.*)\.html$/.exec(files[i]);
    if (filename !== null) {
      if (typeof self.templates[filename[1]] === 'undefined') {
        self.templates[filename[1]] = new Template(self, filename[1]);
      }
    }
  }
  /*
  layout_conf.scripts = layout_conf.scripts.filter(function(elem, pos) {
    return layout_conf.scripts.indexOf(elem) == pos;
  });
  layout_conf.renderers = 'var panels = ' + JSON.stringify(layout_conf);
  */
};

Layout.prototype.watch = function watch(callback) {
  var self = this;
  self.watcher = chokidar.watch(self.path_server, { ignoreInitial: true, ignored: /\/\./ });
  self.watcher.on('add', callback).on('change', callback).on('unlink', callback);
};

var Template = module.exports.Template = function Template(layout, template) {
  this.name = template; 
  this.filename = layout.path_server + '/panels/' + this.name + '.html';
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
