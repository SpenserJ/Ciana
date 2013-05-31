var _ = require('lodash')._
  , Class = require('pseudoclass');

var Collector = Class({
  toString: 'Collector',
  name: 'unnamed_collector',
  last_emit: {},
  frequency: 60,

  construct: function construct(config) {
    _.merge(this, config);
  },

  start: function start() {
    var self = this;
    self.tick();
    self.timer = setInterval(function() { self.tick();  }, self.frequency * 1000);
  },

  setFrequency: function setFrequency(frequency) {
    var self = this;
    self.frequency = frequency;
    if (typeof self.timer !== 'undefined') {
      clearInterval(self.timer);
      self.timer = setInterval(function() { self.tick(); }, self.frequency * 1000);
    }
  },

  tick: function tick() {
    console.log('Tick Tock goes the ' + this.toString);
  },

  emit: function emit(data) {
    this.last_emit = { provider: this.name, panel: this.panel_name, data: data };
    this.sockets.emit('provider', this.last_emit);
  },

  reemit_last: function reemit_last(socket) {
    socket.emit('provider', this.last_emit);
  },

  toTemplate: {},
});

module.exports = Collector;
