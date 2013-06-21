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

    this.checkRequirements();
    this.handleData();
  },

  checkRequirements: function() {
    if (typeof providers[this.provider + '_' + this.name] !== 'undefined') {
      this.provider_object(providers[this.provider + '_' + this.name]);
      var panel = this;
      this.provider_object().data.subscribe(function(data) {
        panel.handleData();
      });
    }
    this.showPanel(typeof this.provider_object() !== 'undefined' &&
                   Object.keys(this.provider_object()).length !== 0 &&
                   this.provider_object().requirementsMet() === true &&
                   $('#template-' + this.template).length !== 0);
  },

  handleData: function() {
    var provider = this.provider_object(); // Call our function if this changes
    var toRender;
    if (typeof provider.data !== 'undefined') { // Can we get data yet?
      var data = provider.data();
      if (typeof provider.formatAs[this.template] === 'function') {
        toRender = provider.formatAs[this.template].call(provider, data);
      }
    }
    if (typeof toRender !== 'undefined') {
      this.data(toRender);
    }
  }
});

var panels = {};
