var _ = require('lodash')._;

var Collector = function Collector() {};

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

Collector.prototype.tick = function tick() {
  console.log('Tick Tock goes the ' + this.name);
};

Collector.prototype.emit = function emit(data) {
  var emit_data = { name: this.name, data: data };
  this.sockets.emit('provider', emit_data);
};

Collector.prototype.toTemplate = {};

module.exports = Collector;
