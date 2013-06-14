var fs = require('fs')
  , conf = require('./config')
  , chokidar = require('chokidar');

var Layout = function Layout(name) {
  console.log('Loading layout ' + name);
  var self = this
    , files, i;
  self.path_client = '/layouts/' + name;
  self.path_server = conf.get('app_path') + '/public' + self.path_client;
  self.templates = {};
  self.templates_client = {};
  self.watcher = null;

  self.loadTemplate('panel');
  /*
  if (typeof layout_conf.scripts === 'undefined') {
    layout_conf.scripts = [];
  }
  if (layout_conf.libraries instanceof Array === true) {
    layout_conf.libraries.forEach(function(library) {
      layout_conf.scripts.push('/public/libraries/' + library);
    });
  }

  layout_conf.scripts = layout_conf.scripts.filter(function(elem, pos) {
    return layout_conf.scripts.indexOf(elem) == pos;
  });
  layout_conf.renderers = 'var panels = ' + JSON.stringify(layout_conf);
  */
};

Layout.prototype.loadTemplate = function loadTemplate(name) {
  this.templates[name] = new Template(this, name);
  this.templates_client[name] = this.templates[name].clientObject();
};

Layout.prototype.watch = function watch(callback) {
  var self = this;
  self.watcher = chokidar.watch(self.path_server, { ignoreInitial: true, ignored: /\/\./ });
  self.watcher.on('add', callback).on('change', callback).on('unlink', callback);
};

var Template = function Template(layout, template) {
  this.name = template; 
  this.html_filename = layout.path_server + '/panels/' + this.name + '.html';
  this.html_base_filename = conf.get('app_path') + '/panels/' + this.name + '.html';

  this.js_filename = layout.path_server + '/panels/' + this.name + '.js';
  this.js_base_filename = conf.get('app_path') + '/panels/' + this.name + '.js';

  if (fs.existsSync(this.html_filename) === true || fs.existsSync(this.html_filename = this.html_base_filename) === true) {
    this.html = fs.readFileSync(this.html_filename, 'utf8');
  }

  if (fs.existsSync(this.js_filename) === true || fs.existsSync(this.js_filename = this.js_base_filename) === true) {
    this.js = fs.readFileSync(this.js_filename, 'utf8');
  }
  /*
  if (panel.libraries instanceof Array === true) {
    panel.libraries.forEach(function(library) {
      layout_conf.scripts.push('/libraries/' + library)
    });
  }
  */
};

Template.prototype.clientObject = function clientObject() {
  var result = {
    name: this.name,
    size: this.size
  };
  if (typeof this.html !== 'undefined') { result.html = this.html; }
  if (typeof this.js   !== 'undefined') { result.js   = this.js;   }
  return result;
};

module.exports.Layout = Layout;
