var Provider = Class({
  toString: 'Provider',
  settings: {},
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

    if (typeof provider_settings[this.provider + '_' + this.panel] !== 'undefined') {
      this.mixin({
        settings: provider_settings[this.provider + '_' + this.panel],
        settings_loaded: true
      });
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
    return (this.scripts.length === 0 &&
            typeof this.settings_loaded !== 'undefined' &&
            this.settings_loaded === true);
  },

  update: function(data) {
    this.data(data);
  }
});

var providers = {};
