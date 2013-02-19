var CianaModel = function() {
  var self = this;

  self.panels = ko.observableArray([]);
};

var PanelModel = function(data) {
  var self = this;

  self.name = data.name;
  self.template = data.template;
  self.data = (typeof data.data === 'undefined') ? {} : data.data;
};

var Ciana = new CianaModel();
ko.applyBindings(Ciana);


/*$.each(panels.panels, function(panel_name, panel) {
  Renderers[panel.type] = window['PanelType_' + panel.type];
  if (typeof Providers[panel.provider] === 'undefined') {
    Providers[panel.provider] = [];
  }
  Providers[panel.provider].push(panel.name);
});*/

var socket = io.connect();

socket.on('reload', function() {
  document.location.reload();
});

socket.on('templates', function (data) {
  $.each(data, function(name, value) {
    var html = value.html;
    if (($template = $('#template-' + name)).length === 0) {
      $('<script type="text/html" id="template-' + name + '">' + html + '</script>').appendTo('head');
    } else {
      $template.html(html);
    }
  });
});

socket.on('provider_update', function (data) {
/*  console.log('provider_update', data);
  var provider = Providers[data.name];
  if (typeof provider === 'undefined') {
    return;
  }
  
  $.each(provider, function(i, panel_name) {
    var panel = panels.panels[panel_name];
    Renderers[panel.type](panel, data);
  });*/
});
