var Panel = Class({
  toString: 'Panel',


  construct: function(data) {
    self = this;

    this.name = data.name;
    this.provider = data.provider;
    this.template = data.template;

    this.title = ko.observable(data.title);
    this.size = ko.observable(data.size);
    this.icon = ko.observable(data.icon);
    this.iconClass = ko.computed(function() {
      var icon = self.icon();
      return (typeof icon !== 'undefined' && icon !== '') ? 'icon-' + icon : '';
    });
    
    this.showPanel = ko.observable(false);
    this.provider_object = ko.observable({});

    this.data = ko.observable({});
    this.data()[this.template] = 'No function to convert between ' + this.provider + ' and ' + this.template;

    this.isReady();
    this.handleData();
  },

  isProviderReady: function() {
    if (typeof this.provider_object().construct === 'undefined' &&
        typeof providers[this.provider + '_' + this.name] !== 'undefined') {
      this.provider_object(providers[this.provider + '_' + this.name]);
      var panel = this;
      this.provider_object().data.subscribe(function() {
        panel.handleData();
      });
    }
    return (
      typeof this.provider_object().construct !== 'undefined' &&
      this.provider_object().isReady() === true
    );
  },

  isTemplateReady: function() {
    return $('#template-' + this.template).length !== 0;
  },

  isReady: function() {
    return (
      this.isProviderReady() === true &&
      this.isTemplateReady() === true
    );
  },

  handleData: function() {
    if (this.isProviderReady() === false) {
      return;
    }
    var provider = this.provider_object();
    var toRender = provider.formatAs[this.template].call(provider, this.provider_object().data());
    if (typeof toRender !== 'undefined') {
      this.data(toRender);
    }

    if (this.showPanel() === false) {
      this.showPanel(this.isReady());
    }
  }
});

var panels = {};
