var Plugin_Time = require('../lib/plugin/collector');
Plugin_Time.prototype.name = 'time';
Plugin_Time.prototype.defaults = {
  frequency: 1
}

Plugin_Time.prototype.tick = function() {
  this.emit({ date: new Date(), text: '' });
}

var toTemplate = {
  toString: function toTime(data) {
    var date = new Date(data.date);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  },
  text_date: function text_date(data) {
    return { text: new Date(data.date).toLocaleDateString() };
  }
};

module.exports.plugin = Plugin_Time;
module.exports.toTemplate = toTemplate;
