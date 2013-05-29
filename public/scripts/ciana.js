var CianaModel = function CianaModel() {
  var self = this, $panels = $('#panels');

  self.panels = ko.observableArray([]);
  self.providers = ko.observableArray([]);
  self.toTemplate = {};

  self.updateIsotope = function updateIsotope(element) {
    $panels.isotope('appended', $(element)).isotope('reLayout');
  };
  $panels.isotope();
};

CianaModel.prototype.createPanelIfMissing = function createPanelIfMissing(data) {
  var self = this
    , panels = ko.toJS(self.panels)
    , found_index = null;
  $.each(panels, function(index, checking) {
    if (found_index === null && data.name === checking.name) {
      found_index = index;
    }
  });
  if (found_index === null) {
    self.panels.push(new PanelModel(data));
    found_index = self.panels().length - 1;
  }
  return found_index;
};

CianaModel.prototype.createProviderIfMissing = function createProviderIfMissing(provider, panel) {
  var self = this
    , providers = ko.toJS(self.providers)
    , found_index = null;
  $.each(providers, function(index, checking) {
    if (found_index === null && provider === checking.provider && panel === checking.panel) {
      found_index = index;
    }
  });
  if (found_index === null) {
    self.providers.push(new ProviderModel({ provider: provider, panel: panel, data: { } }));
    found_index = self.providers().length - 1;
  }
  return found_index;
};

var PanelModel = function(data) {
  var self = this;

  self.name = data.name;
  self.template = data.template;
  self.provider = data.provider;
  self.toTemplate = data.toTemplate;

  self.title = data.title;
  self.size = data.size;
  self.icon = '';

  self.provider_object = ko.observable(Ciana.providers()[Ciana.createProviderIfMissing(self.provider, self.name)]);
  self.data = ko.computed(function() {
    var data = self.provider_object().data()
      , toTemplate = (typeof self.toTemplate !== 'undefined') ? self.toTemplate : self.template;
    if (typeof Ciana.toTemplate[self.provider] === 'undefined') {
      return data;
    }
    var toTemplateFunction = Ciana.toTemplate[self.provider];
    if (typeof toTemplateFunction[toTemplate] === 'undefined') {
      if (typeof toTemplateFunction.toString  !== 'undefined') {
        data = toTemplateFunction.toString(data);
        return (typeof data === 'object') ? data : { text: toTemplateFunction.toString(data) };
      }
      return data;
    }
    return toTemplateFunction[toTemplate](data);
  });
  self.showPanel = ko.computed(function() { var data = self.data(); return (typeof data === 'object' && Object.keys(data).length !== 0); });
  self.showIcon = ko.computed(function()  { return self.icon !== ''; });
};

var ProviderModel = function(data) {
  var self = this;

  console.log(data);
  self.provider = data.provider;
  self.panel = data.panel;
  self.data = ko.observable((typeof data.data === 'undefined') ? {} : data.data);
};

var Ciana = new CianaModel();
ko.applyBindings(Ciana);

var socket = io.connect();

socket.on('reload', function() {
  document.location.reload();
});

socket.on('templates', function (data) {
  var panels = ko.toJS(Ciana.panels);
  $.each(data, function(template_name, value) {
    var html = value.html;
    if (($template = $('#template-' + template_name)).length === 0) {
      $('<script type="text/html" id="template-' + template_name + '">' + html + '</script>').appendTo('head');
    } else {
      $template.html(html);
      $.each(panels, function(index, value) {
        if (value.template === template_name) {
          Ciana.panels()[index].provider_object(Ciana.panels()[index].provider_object());
        }
      });
    }
  });
});

socket.on('panels', function (data) {
  $.each(data, function(name, panel_data) {
    var panel = Ciana.panels()[Ciana.createPanelIfMissing(panel_data)];
  });
});

socket.on('provider', function (data) {
  var provider = Ciana.providers()[Ciana.createProviderIfMissing(data.provider, data.panel)];
  provider.data(data.data);
  console.log('provider', provider);
  console.log('provider', data);
});

socket.on('provider_to', function (data) {
  $.each(data, function(provider, functions) {
    var toTemplate = {};
    $.each(functions, function(name, value) {
      /*jslint evil: true */
      // We do this so that we can dynamically update our data converters as needed
      toTemplate[name] = new Function('return (' + value + ')')();
    });
    Ciana.toTemplate[provider] = toTemplate;
  });
});
