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
  },

  loadProvider: function() {
    this.provider_object(providers[this.provider + '_' + this.name]);
    this.showPanel(typeof this.provider_object() !== 'undefined' &&
                   $('#template-' + this.template).length !== 0);
  },

  raw_data: function() {
    return this.provider_object().data();
  },

  data: function() {
    if (typeof this['formatAs_' + this.template] === 'function') {
      return this['formatAs_' + this.template](this.raw_data());
    }
    return { text: 'No function to convert between ' + this.provider + ' and ' + this.template };
  }
});

var panels = {};
