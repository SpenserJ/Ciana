var Collector = function Collector() {
};

Collector.prototype.super_ = function super_(config, sockets) {
  var self = this;

  self.sockets = sockets;

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
  self.timer = setInterval(function() { self.tick(); }, self.frequency * 1000);
};

Collector.prototype.tick = function tick() {
  var self = this;
  console.log('Tick Tock');
};

Collector.prototype.emit = function emit(data) {
  var self = this;
  var emit = { name: self.name, data: data };
  self.sockets.emit('provider', emit);
};

Collector.prototype.toTemplate = {};

module.exports = Collector;
