var Provider = Class({
  toString: 'Provider',
  scripts: [],
  formatAs: {},

  construct: function(provider, panel) {
    this.provider = provider;
    this.panel = panel;
    this.data = ko.observable({});

    if (typeof provider_mixins[this.provider] !== 'undefined') {
      this.mixin(provider_mixins[this.provider]);
      this.loadScripts();
    }
  },

  loadScripts: function() {
    var i;
    for (i = 0; i < this.scripts.length; i++) {
      resources.loadScript(this.scripts[i], this.scriptLoadedCallback, this);
    }
  },

  scriptLoadedCallback: function(url) {
    var index = this.scripts.indexOf(url);
    if (index !== -1) {
      this.scripts.splice(this.scripts.indexOf(url), 1);
    }
    if (this.requirementsMet() === true) {
      panels[this.panel].checkRequirements();
    }
  },

  requirementsMet: function() {
    return (this.scripts.length === 0);
  },

  update: function(data) {
    this.data(data);
  }
});

var providers = {};
