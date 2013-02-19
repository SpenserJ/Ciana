var conf = require('./config')
  , http = require('http')
  , express = require('express')
  , lessMiddleware = require('less-middleware')
  , fs = require('fs')
  , jade = require('jade');

var app = exports.webapp = express()
  , server = exports.webserver = http.createServer(app);

app.configure(function() {
  app.engine('html', require('ejs').renderFile);

  app.use(lessMiddleware({
    src: conf.get('app_path') + '/public',
    compress: true
  }));

  app.use(express.static(conf.get('app_path') + '/public'));
});

app.get('/', function(req, res) {
  var rendered = '';
  layout_conf = require(conf.get('app_path') + '/public/layouts/default/config.json');
  if (typeof layout_conf.panels === 'undefined') {
    layout_conf.panels = {};
  }
  if (typeof layout_conf.scripts === 'undefined') {
    layout_conf.scripts = [];
  }
  if (layout_conf.libraries instanceof Array === true) {
    layout_conf.libraries.forEach(function(library) {
      layout_conf.scripts.push('/public/libraries/' + library);
    });
  }
  Object.keys(layout_conf.panels).forEach(function(panel_name) {
    var panel = layout_conf.panels[panel_name];
    panel.name = panel_name;
    panel.filename = conf.get('app_path') + '/public/layouts/default/panels/' + panel.type + '.jade';
    panel.content = jade.compile(fs.readFileSync(panel.filename), panel)();
    if (panel.libraries instanceof Array === true) {
      panel.libraries.forEach(function(library) {
        layout_conf.scripts.push('/libraries/' + library)
      });
    }
    layout_conf.scripts.push('/layouts/default/panels/' + panel.type + '.js')
    rendered += jade.compile(fs.readFileSync(conf.get('app_path') + '/public/layouts/default/panels/panel.jade'))(panel);
  });
  layout_conf.rendered_panels = rendered;
  layout_conf.scripts = layout_conf.scripts.filter(function(elem, pos) {
    return layout_conf.scripts.indexOf(elem) == pos;
  });
  layout_conf.renderers = 'var panels = ' + JSON.stringify(layout_conf);
  res.send(fs.readFileSync(conf.get('app_path') + '/public/layouts/default/index.html', 'utf8'));
});

server.listen(conf.get('port'));
