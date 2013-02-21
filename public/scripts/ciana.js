var CianaModel = function CianaModel() {
  var self = this;

  self.panels = ko.observableArray([]);
  self.providers = ko.observableArray([]);
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

CianaModel.prototype.createProviderIfMissing = function createProviderIfMissing(name) {
  var self = this
    , providers = ko.toJS(self.providers)
    , found_index = null;
  $.each(providers, function(index, checking) {
    if (found_index === null && name === checking.name) {
      found_index = index;
    }
  });
  if (found_index === null) {
    self.providers.push(new ProviderModel({ name: name, data: { } }));
    found_index = self.providers().length - 1;
  }
  return found_index;
};

var PanelModel = function(data) {
  var self = this;

  self.name = data.name;
  self.template = data.template;
  self.provider = data.provider;

  self.title = data.title;
  self.size = data.size;
  self.icon = '';

  self.data = ko.observable(Ciana.providers()[Ciana.createProviderIfMissing(self.provider)]);
  self.showIcon = ko.computed(function() { self.icon != ''; });
};

var ProviderModel = function(data) {
  var self = this;

  self.name = data.name;
  data.data = { text: 'test' };
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
          Ciana.panels()[index].data(panels[index].data);
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
  var provider = Ciana.providers()[Ciana.createProviderIfMissing(data.name)];
  provider.data(data.data);
});
