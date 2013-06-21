var fs = require('fs')
  , conf = require('./config')
  , chokidar = require('chokidar')
  , Utilities = require('./utilities');

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
  this.layout = layout;

  var filename;

  if ((filename = this.getPath('html')) !== false) {
    this.html = fs.readFileSync(filename, 'utf8');
  }

  if ((filename = this.getPath('js')) !== false) {
    this.js = require(filename);
  }

  /*
  if (panel.libraries instanceof Array === true) {
    panel.libraries.forEach(function(library) {
      layout_conf.scripts.push('/libraries/' + library)
    });
  }
  */
};

Template.prototype.getPath = function getPath(format) {
  var path;
  if (fs.existsSync(path = this.layout.path_server + '/panels/' + this.name + '/' + this.name + '.' + format) === true ||
      fs.existsSync(path = conf.get('app_path') + '/panels/' + this.name + '/' + this.name + '.' + format) === true) {
    return path;
  }
  return false;
};

Template.prototype.clientObject = function clientObject() {
  var result = {
    name: this.name,
    size: this.size
  };
  if (typeof this.html !== 'undefined') { result.html = this.html; }
  if (typeof this.js   !== 'undefined') { result.js   = Utilities.recursiveStringifyFunctions(this.js); }
  return result;
};

module.exports.Layout = Layout;
