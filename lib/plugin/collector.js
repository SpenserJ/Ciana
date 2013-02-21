var Collector = function Collector() {
}

Collector.prototype.super_ = function super_(config) {
  var self = this;

  // Defaults as defined by the provider base
  self.frequency = 60;

  if (typeof self.defaults === 'undefined') {
    self.defaults = {};
  }

  // Defaults as defined by the provider
  Object.keys(self.defaults).forEach(function(key) {
    self[key] = self.defaults[key];
  });

  if (typeof config === 'undefined') {
    config = {};
  }

  // Defaults as defined by the config
  Object.keys(config).forEach(function(key) {
    self[key] = config[key];
  });
};

Collector.prototype.start = function start() {
  var self = this;
  self.tick();
  self.timer = setInterval(self.tick, self.frequency * 1000);
};

Collector.prototype.tick = function tick() {
  console.log('Tick Tock');
}

module.exports = Collector;
