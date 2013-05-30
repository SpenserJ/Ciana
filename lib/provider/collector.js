var _ = require('lodash')._;

var Collector = function Collector() { this.last_emit = {}; };

// Defaults as defined by the provider base
Collector.prototype.base_defaults = {
  frequency: 60
};

Collector.prototype.configure = function configure(config) {
  _.merge(this, this.base_defaults, this.defaults, config);
};

Collector.prototype.start = function start() {
  var self = this;
  self.tick();
  self.timer = setInterval(function() { self.tick(); }, self.frequency * 1000);
};

Collector.prototype.setFrequency = function setFrequency(frequency) {
  var self = this;
  self.frequency = frequency;
  if (typeof self.timer !== 'undefined') {
    clearInterval(self.timer);
    self.timer = setInterval(function() { self.tick();  }, self.frequency * 1000);
  }
};

Collector.prototype.tick = function tick() {
  console.log('Tick Tock goes the ' + this.name);
};

Collector.prototype.emit = function emit(data) {
  this.last_emit = { provider: this.name, panel: this.panel_name, data: data };
  this.sockets.emit('provider', this.last_emit);
};

Collector.prototype.reemit_last = function reemit_last(socket) {
  socket.emit('provider', this.last_emit);
};

Collector.prototype.toTemplate = {};

module.exports = Collector;
