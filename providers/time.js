var Provider_Time = function Provider_Time(config) { this.configure(config); };
Provider_Time.prototype = new (require('../lib/provider/collector'));
Provider_Time.prototype.name = 'time';
Provider_Time.prototype.defaults = {
  frequency: 1
};

Provider_Time.prototype.tick = function() {
  this.emit({ date: new Date() });
};

var toTemplate = {
  toString: function toTime(data) {
    var date = new Date(data.date);
    return { text: date.toLocaleDateString() + ' at ' + date.toLocaleTimeString() };
  },
  text_date: function text_date(data) {
    return { text: new Date(data.date).toLocaleDateString() };
  }
};

module.exports.provider = Provider_Time;
module.exports.toTemplate = toTemplate;
