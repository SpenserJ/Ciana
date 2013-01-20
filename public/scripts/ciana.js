var socket = io.connect();

var Renderers = {}
  , Providers = {};

$.each(panels.panels, function(panel_name, panel) {
  Renderers[panel.type] = window['PanelType_' + panel.type];
  if (typeof Providers[panel.provider] === 'undefined') {
    Providers[panel.provider] = [];
  }
  Providers[panel.provider].push(panel.name);
});

socket.on('provider_update', function (data) {
  console.log('provider_update', data);
  var provider = Providers[data.name];
  if (typeof provider === 'undefined') {
    return;
  }
  
  $.each(provider, function(i, panel_name) {
    var panel = panels.panels[panel_name];
    Renderers[panel.type](panel, data);
  });
});
socket.on('initialize', function (data) {
  console.log('initialize', data);
});
