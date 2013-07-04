var Provider = Class({
  toString: 'Provider',
  settings: {},
  settingsLoaded: false,
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
    var i, scriptsArchive = this.scripts.slice();
    for (i = 0; i < scriptsArchive.length; i++) {
      resources.loadScript(scriptsArchive[i], this.scriptLoadedCallback, this);
    }
  },

  scriptLoadedCallback: function(url) {
    var index = this.scripts.indexOf(url);
    if (index !== -1) {
      this.scripts.splice(this.scripts.indexOf(url), 1);
    }
    if (this.isReady() === true) {
      panels[this.panel].handleData();
    }
  },

  isReady: function() {
    return (
      this.scripts.length === 0 &&
      this.settings_loaded === true &&
      Object.keys(this.data()).length !== 0 &&
      typeof this.formatAs[panels[this.panel].template] === 'function'
    );
  }
});

var providers = {};
