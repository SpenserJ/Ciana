var Provider = Class({
  toString: 'Provider',
  construct: function(provider, panel) {
    this.provider = provider;
    this.panel = panel;
    this.data = ko.observable({});
  },
  update: function(data) {
    this.data(data);
  }
});

var providers = {};
