var _ = require('lodash')._
  , Class = require('pseudoclass');

var Collector = Class({
  toString: 'Collector',
  name: 'unnamed_collector',
  last_emit: {},
  default_settings: {
    frequency: 60,
  },

  construct: function construct(config) {
    this.panel_name = config.panel_name;
    delete config.panel_name;

    this.settings = {};

    var _super = Object.getPrototypeOf(this), _super_list = [];
    while (_super !== null) {
      if (typeof _super.default_settings !== 'undefined') {
        _super_list.push(_super);
      }
      _super = Object.getPrototypeOf(_super);
    }

    var i;
    for (i = _super_list.length - 1; i > -1; i--) {
      _.merge(this.settings, _super_list[i].default_settings);
    }
    _.merge(this.settings, config);

    console.log('Constructing provider ' + this.name);
  },

  start: function start() {
    var self = this;
    self.tick();
    self.timer = setInterval(function() { self.tick();  }, self.settings.frequency * 1000);
  },

  setFrequency: function setFrequency(frequency) {
    var self = this;
    if (self.settings.frequency === frequency) {
      return;
    }
    console.log('Frequency changing from ' + self.settings.frequency + ' to ' + frequency);
    self.settings.frequency = frequency;
    if (typeof self.timer !== 'undefined') {
      clearInterval(self.timer);
      self.timer = setInterval(function() { self.tick(); }, self.settings.frequency * 1000);
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
