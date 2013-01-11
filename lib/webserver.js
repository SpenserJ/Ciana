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
  Object.keys(layout_conf.panels).forEach(function(panel_name) {
    var panel = layout_conf.panels[panel_name];
    panel.name = panel_name;
    panel.content = jade.compile(fs.readFileSync(conf.get('app_path') + '/public/layouts/default/panels/' + panel.type + '.jade'), panel)();
    rendered += jade.compile(fs.readFileSync(conf.get('app_path') + '/public/layouts/default/panels/panel.jade'))(panel);
  });
  layout_conf.rendered_panels = rendered;
  res.render(conf.get('app_path') + '/public/layouts/default/index.jade', layout_conf);
});

server.listen(conf.get('port'));
