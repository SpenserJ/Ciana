var request = require('request')
  , util = require('util');

var Provider_GitHub = function Provider_GitHub(config) { this.configure(config); };
Provider_GitHub.prototype = new (require('../lib/provider/collector'));
Provider_GitHub.prototype.name = 'github';
Provider_GitHub.prototype.defaults = {
  frequency: 5 * 60,
  api: null
};

Provider_GitHub.prototype.tick = function() {
  var self = this;
  if (self.api === null) {
    return;
  }
  if (typeof self.frequency_user === 'undefined') {
    self.frequency_user = self.frequency;
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
    options.headers.ETag = self.etag;
  }
  console.log(options);

  request(options, function (error, response, body) {
    if (!error) {
      self.frequency = Math.max(self.frequency_user, response['X-Poll-Interval']);
      self.etag = response.ETag;
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
};

var toTemplate = {
  toString: function toString(data) {
    var text = '', i, eventCount = data.response.length, event;
    for (i = 0; i < eventCount; i++) {
      event = data.response[i];
      text += event.actor.login + ' had a ' + event.type + ' at ' + event.created_at + '\n';
    }
    return { text: text };
  }
};

module.exports.provider = Provider_GitHub;
module.exports.toTemplate = toTemplate;
