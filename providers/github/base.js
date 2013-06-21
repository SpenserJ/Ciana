var Collector = require('../../lib/provider/collector')
  , request = require('request')
  , util = require('util');

var Server = Collector.extend({
  toString: 'Provider_GitHub',
  name: 'github/base',
  default_settings: {
    frequency: 5 * 60,
    api: null,
  },

  construct: function construct() {
    this.settings.frequency_user = this.settings.frequency;
  },

  tick: function tick() {
    var self = this;
    if (self.settings.api === null) {
      return;
    }

    if (self.settings.api instanceof Array === true) {
      self.settings.api = util.format.apply(this, self.settings.api);
    }

    var options = {
      uri: 'https://api.github.com/' + self.settings.api,
      headers: {
        'User-Agent': 'SpenserJ/Ciana'
      }
    };
    if (typeof self.etag !== 'undefined') {
      options.headers['If-None-Match'] = self.etag;
    }

    request(options, function (error, response, body) {
      if (!error) {
        if (typeof response.headers['x-poll-interval'] === 'undefined') {
          self.setFrequency(self.settings.frequency_user);
        } else {
          self.setFrequency(Math.max(self.settings.frequency, response.headers['x-poll-interval']));
        }
        if (typeof response.headers.etag !== 'undefined') {
          self.etag = response.headers.etag;
        }
        if (response.statusCode === 200) {
          var data = JSON.parse(body);
          self.emit({ error: error, response: data });
        }
      }
    });
  },
});

var Client = {
  scripts: [
    '//cdnjs.cloudflare.com/ajax/libs/rickshaw/1.2.1/rickshaw.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/d3/3.1.6/d3.min.js'
  ],

  graph: {
    data: {
      render: 'line',
      series: [{ data: [] }]
    },
  },

  formatAs: {
    text: function text(data) {
      if (typeof data.response === 'undefined') {
        return { text: '' };
      }
      var value = '', i, eventCount = data.response.length, event;
      for (i = 0; i < eventCount; i++) {
        event = data.response[i];
        value += event.actor.login + ' had a ' + event.type + ' at ' + event.created_at + '\n';
      }
      return { text: value };
    },

    graph: function toString(data) {
      var i, eventCount = data.response.length, event, eventTypes = {}, eventTypeKeys, eventDates, eventDatesCount, eventDatesIndex
        , minDate, maxDate;
      for (i = 0; i < eventCount; i++) {
        event = data.response[i];
        if (typeof eventTypes[event.type] === 'undefined') {
          eventTypes[event.type] = {};
        }
        date = Math.floor(new Date(event.created_at) / 86400 / 1000);
        if (typeof eventTypes[event.type][date] === 'undefined') {
          eventTypes[event.type][date] = 1;
        } else {
          eventTypes[event.type][date]++;
        }
        if (typeof minDate === 'undefined' || date < minDate) {
          minDate = date;
        }
        if (typeof maxDate === 'undefined' || date > maxDate) {
          maxDate = date;
        }
      }
      eventTypeKeys = Object.keys(eventTypes);
      eventCount = eventTypeKeys.length;
      this.graph.data.series.length = 0; // Clear the series array
      var palette = new Rickshaw.Color.Palette();
      for (i = 0; i < eventCount; i++) {
        event = [];
        eventDates = Object.keys(eventTypes[eventTypeKeys[i]]);
        for (date = minDate; date < maxDate + 1; date++) {
          if (typeof eventTypes[eventTypeKeys[i]][date] === 'undefined') {
            event.push({ x: date, y: 0 });
          } else {
            event.push({ x: date, y: eventTypes[eventTypeKeys[i]][date] });
          }
        }
        this.graph.data.series.push({ name: eventTypeKeys[i], data: event, color: palette.color() });
      }

      if (typeof this.graph.rickshaw !== 'undefined') {
        this.graph.rickshaw.update();
      }
    }
  }
};

module.exports.Server = Server;
module.exports.Client = Client;
