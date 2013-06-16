var Collector = require('../lib/provider/collector')
  , parser = require('feedparser');

var Server = Collector.extend({
  toString: 'Provider_RSS',
  name: 'rss',
  default_settings: {
    frequency: 5 * 60,
  },

  tick: function tick() {
    var self = this;
    parser.parseUrl(self.settings.url, { addmeta: false }, function (error, meta, articles) {
      self.emit({ error: error, meta: meta, articles: articles });
    });
  },
});

var Client = {
  formatAs: {
    text: function text(data) {
      if (typeof data.articles === 'undefined') {
        return { text: '' };
      }
      var value = '';
      $.each(data.articles, function(index, article) {
        value += article.title + "\n";
      });
      return { text: value };
    },
    html: function html(data) {
      if (typeof data.articles === 'undefined') {
        return { html: '<ul></ul>' };
      }
      var value = '<ul>';
      $.each(data.articles, function(index, article) {
        value += '<li><a href="' + article.link + '" target="_blank">' + article.title + '</a></li>';
      });
      value += '</ul>';
      return { html: value };
    }
  }
};

module.exports.Server = Server;
module.exports.Client = Client;
