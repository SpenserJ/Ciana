var Collector = require('../lib/provider/collector');

var Server = Collector.extend({
  toString: 'Provider_Time',
  name: 'time',
  default_settings: {
    frequency: 1,
  },

  tick: function tick() {
    this.emit({ date: new Date()  });
  }
});

var Client = {
  scripts: [
    '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min.js'
  ],
  formatAs: {
    text: function formatAs_text(data) {
      var format = (typeof this.settings.format === 'undefined') ? 'LLLL' : this.settings.format;
      return { text: moment(data.date).format(format) };
    }
  }
};

module.exports.Server = Server;
module.exports.Client = Client;
