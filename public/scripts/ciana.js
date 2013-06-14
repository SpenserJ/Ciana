var CianaModel = function CianaModel() {
  var self = this, $panels = $('#panels');

  self.panels = ko.observableArray([]);
  self.providers = ko.observableArray([]);

  self.updateIsotope = function updateIsotope(element) {
    $panels.isotope('appended', $(element)).isotope('reLayout');
  };
  $panels.isotope();
};

var Ciana = new CianaModel();
ko.applyBindings(Ciana);

var socket = io.connect();

socket.on('reload', function() {
  document.location.reload();
});

socket.on('templates', function (data) {
  $.each(data, function(template_name, value) {
    Template(value);
    $.each(panels, function(name, panel) {
      if (panel.template === template_name) {
        panel.checkRequirements();
      }
    });
  });
});

socket.on('connect', function() {
  socket.emit('initialize', { screen: 'default' });
});

socket.on('panels', function (data) {
  $.each(data, function(name, panel_data) {
    panels[name] = new Panel(panel_data);
  });
  Ciana.panels($.map(panels, function(k, v) {
    return [k];
  }));
});

socket.on('provider', function (data) {
  if (typeof providers[data.provider + '_' + data.panel] === 'undefined') {
    providers[data.provider + '_' + data.panel] = new Provider(data.provider, data.panel);
    Ciana.providers($.map(providers, function(k, v) {
      return [k];
    }));
    $.each(panels, function(name, panel) {
      if (panel.provider === data.provider && panel.name === data.panel) {
        panel.checkRequirements();
      }
    });
  }
  providers[data.provider + '_' + data.panel].update(data.data);
});

socket.on('provider_to', function (data) {
/*
  $.each(data, function(provider, functions) {
    var toTemplate = {};
    $.each(functions, function(name, value) {
*/
      /*jslint evil: true */
      // We do this so that we can dynamically update our data converters as needed
/*
      toTemplate[name] = new Function('return (' + value + ')')();
    });
    Ciana.toTemplate[provider] = toTemplate;
  });
*/
});
