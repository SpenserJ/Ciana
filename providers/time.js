var Collector = require('../lib/provider/collector');

var Provider_Time = Collector.extend({
  toString: 'Provider_Time',
  name: 'time',
  frequency: 1,

  tick: function tick() {
    this.emit({ date: new Date()  });
  },

  toTemplate: {
    toString: function toString(data) {
      var date = new Date(data.date);
      return { text: date.toLocaleDateString() + ' at ' + date.toLocaleTimeString() };
    },
    text_date: function text_date(data) {
      return { text: new Date(data.date).toLocaleDateString() };
    }
  }
});

module.exports = Provider_Time;
