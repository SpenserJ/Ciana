var Provider = Class({
  toString: 'Provider',
  formatAs: {},

  construct: function(provider, panel) {
    this.provider = provider;
    this.panel = panel;
    this.data = ko.observable({});

    if (typeof provider_mixins[this.provider] !== 'undefined') {
      this.mixin(provider_mixins[this.provider]);
    }
  },
  update: function(data) {
    this.data(data);
  }
});

var providers = {};
