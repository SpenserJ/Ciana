var Plugin_Time = require('../lib/plugin/collector');
Plugin_Time.prototype.name = 'time';
Plugin_Time.prototype.defaults = {
  frequency: 1
}

Plugin_Time.prototype.tick = function() {
  this.emit({ date: new Date(), text: '' });
}

var toTemplate = {
  toTime: function toTime() {
    console.log(this.data());
  }
};

module.exports.plugin = Plugin_Time;
module.exports.toTemplate = toTemplate;
