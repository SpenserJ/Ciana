var Panel = Class({
  toString: 'Panel',

  title: ko.observable(''),
  size: ko.observable(''),
  icon: ko.observable(''),

  showPanel: ko.observable(false),
  showIcon: ko.observable(false),

  provider_object: ko.observable({}),

  construct: function(data) {
    this.self = this;

    this.name = data.name;
    this.provider = data.provider;
    this.template = data.template;

    this.title(data.title);
    this.size(data.size);
    this.icon(data.icon);

    this.checkRequirements();
  },

  checkRequirements: function() {
    if (typeof providers[this.provider + '_' + this.name] !== 'undefined') {
      this.provider_object(providers[this.provider + '_' + this.name]);
    }
    this.showPanel(typeof this.provider_object() !== 'undefined' &&
                   Object.keys(this.provider_object()).length !== 0 &&
                   this.provider_object().requirementsMet() === true &&
                   $('#template-' + this.template).length !== 0);
  },

  raw_data: function() {
    return this.provider_object().data();
  },

  data: function() {
    var provider = this.provider_object();
    if (typeof provider.data !== 'undefined') {
      var data = this.raw_data();
      if (typeof provider.formatAs[this.template] === 'function') {
        return provider.formatAs[this.template](data);
      }
    }
    return { text: 'No function to convert between ' + this.provider + ' and ' + this.template };
  }
});

var panels = {};
