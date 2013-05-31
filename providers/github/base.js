var Collector = require('../../lib/provider/collector')
  , request = require('request')
  , util = require('util');

var Provider_GitHub = Collector.extend({
  toString: 'Provider_GitHub',
  name: 'github/base',
  frequency: 5 * 60,
  api: null,

  construct: function construct() {
    this.frequency_user = this.frequency;
  },

  tick: function tick() {
    var self = this;
    if (self.api === null) {
      return;
    }

    if (self.api instanceof Array === true) {
      self.api = util.format.apply(this, self.api);
    }

    var options = {
      uri: 'https://api.github.com/' + self.api,
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
          self.setFrequency(self.frequency_user);
        } else {
          self.setFrequency(Math.max(self.frequency, response.headers['x-poll-interval']));
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

  toTemplate: {
    toString: function toString(data) {
      var text = '', i, eventCount = data.response.length, event;
      for (i = 0; i < eventCount; i++) {
        event = data.response[i];
        text += event.actor.login + ' had a ' + event.type + ' at ' + event.created_at + '\n';
      }
      return { text: text };
    }
  }
});

module.exports = Provider_GitHub;
