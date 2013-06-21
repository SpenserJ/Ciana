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
  providers[data.provider + '_' + data.panel].data(data.data);
});

var provider_mixins = {};
socket.on('provider_mixins', function (data) {
  $.each(data, function(provider_name, functions) {
    var mixin = recursiveUnstringifyFunctions(functions);
    provider_mixins[provider_name] = mixin;
    $.each(providers, function(provider_panel_name, check_provider) {
      if (provider_name === check_provider.provider) {
        check_provider.mixin(mixin);
        check_provider.loadScripts();
      }
    });
  });
});

var provider_settings = {};
socket.on('provider_setting', function (data) {
  var provider_panel_name = data.provider + '_' + data.panel;
  provider_settings[provider_panel_name] = data.settings;
  if (typeof providers[provider_panel_name] !== 'undefined') {
    providers[provider_panel_name].mixin({
      settings: data.settings,
      settings_loaded: true
    });
  }
});
