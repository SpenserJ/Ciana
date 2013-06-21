var ResourceManager = Class({
  toString: 'ResourceManager',
  scriptsLoading: {},
  scriptsLoaded: [],

  construct: function() {

  },

  loadScript: function(url, callback, scope) {
    var self = this;
    if (this.scriptsLoaded.indexOf(url) !== -1) {
      callback.call(scope, url);
    } else if (typeof this.scriptsLoading[url] !== 'undefined') {
      this.scriptsLoading[url].push([callback, scope]);
    } else {
      this.scriptsLoading[url] = [[callback, scope]];
      $.getScript(url, function(script, textStatus, jqXHR) {
        self.scriptLoadedCallback(url);
      });
    }
  },

  scriptLoadedCallback: function(url) {
    var i, callback;
    this.scriptsLoaded.push(url);
    for (i = 0; i < this.scriptsLoading[url].length; i++) {
      callback = this.scriptsLoading[url][i];
      callback[0].call(callback[1], url);
    }
    delete this.scriptsLoading[url];
  },
});

resources = new ResourceManager();
