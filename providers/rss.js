var Collector = require('../lib/provider/collector')
  , parser = require('feedparser');

var Provider_RSS = Collector.extend({
  toString: 'Provider_RSS',
  name: 'rss',
  frequency: 5 * 60,

  tick: function tick() {
    var self = this;
    parser.parseUrl(self.url, { addmeta: false }, function (error, meta, articles) {
      self.emit({ error: error, meta: meta, articles: articles });
    });
  },

  toTemplate: {
    toString: function toString(data) {
      console.log(data);
      var value = '';
      $.each(data.articles, function(index, article) {
        value += article.title + "\n";
      });
      return { text: value };
    },
    html: function html(data) {
      var value = '<ul>';
      $.each(data.articles, function(index, article) {
        value += '<li><a href="' + article.link + '" target="_blank">' + article.title + '</a></li>';
      });
      value += '</ul>';
      return { html: value };
    }
  }
});

module.exports = Provider_RSS;
