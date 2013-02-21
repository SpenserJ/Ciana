var Provider_Time = require('../lib/provider/collector');
Provider_Time.prototype.name = 'time';
Provider_Time.prototype.defaults = {
  frequency: 1
}

Provider_Time.prototype.tick = function() {
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

module.exports.provider = Provider_Time;
module.exports.toTemplate = toTemplate;
