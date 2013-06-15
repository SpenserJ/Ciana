var Collector = require('../lib/provider/collector');

var Server = Collector.extend({
  toString: 'Provider_Time',
  name: 'time',
  frequency: 1,

  tick: function tick() {
    this.emit({ date: new Date()  });
  }
});

var Client = {
  formatAs: {
    text: function formatAs_text(data) {
      var date = new Date(data.date);
      return { text: date.toLocaleDateString() + ' at ' + date.toLocaleTimeString() };
    }
  }
};

module.exports.Server = Server;
module.exports.Client = Client;
