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
          var data = JSON.parse(body)
            , toEmit = []
            , eventCount = data.length, eventIndex, event
            , filterCount, filterIndex, filter, filterKeys
            , keyCount, keyIndex, key
            , pass, score;
            for (eventIndex = 0; eventIndex < eventCount; eventIndex++) {
              event = data[eventIndex];
              if (self.filter instanceof Array === true) {
                pass = false;
                filterCount = self.filter.length;
                for (filterIndex = 0; filterIndex < filterCount; filterIndex++) {
                  filter = self.filter[filterIndex]; // { type: 'PushEvent' }
                  filterKeys = Object.keys(filter);
                  score = 0;
                  keyCount = filterKeys.length;
                  for (keyIndex = 0; keyIndex < keyCount; keyIndex++) {
                    key = filterKeys[keyIndex];
                    if (event[key] === filter[key]) {
                      score++;
                    }
                  }
                  if (score === filterKeys.length) {
                    pass = true;
                    break;
                  }
                }
                if (pass === true) {
                  toEmit.push(event);
                }
              }
            }
          self.emit({ error: error, response: toEmit });
        }
      }
    });
  },
});

var Client = {
  formatAs: {
    text: function text(data) {
      if (typeof data.response === 'undefined') {
        return { text: '' };
      }
      var text = '', i, eventCount = data.response.length, event;
      for (i = 0; i < eventCount; i++) {
        event = data.response[i];
        text += event.actor.login + ' had a ' + event.type + ' at ' + event.created_at + '\n';
      }
      return { text: text };
    }
  }
};

module.exports.Server = Server;
module.exports.Client = Client;
