var _ = require('lodash')._
  , parser = require('feedparser');

var Provider_RSS = function Provider_RSS(config) { this.configure(config); };
Provider_RSS.prototype = new (require('../lib/provider/collector'));
Provider_RSS.prototype.name = 'rss';
Provider_RSS.prototype.defaults = {
  frequency: 5 * 60
};

Provider_RSS.prototype.tick = function() {
  var self = this;
  parser.parseUrl(self.url, { addmeta: false }, function(error, meta, articles) {
    self.emit({ error: error, meta: meta, articles: articles });
  });
};

var toTemplate = {
  toString: function toString(data) {
    console.log(data);
    var value = '';
    $.each(data.articles, function(index, article) {
      value += article.title + "\n";
    });
    return { text: value };
  },
  html: function html(data) {
    var value = '';
    $.each(data.articles, function(index, article) {
      value += '<a href="' + article.link + '" target="_blank">' + article.title + '</a><br />';
    });
    return { html: value };
  }
};

module.exports.provider = Provider_RSS;
module.exports.toTemplate = toTemplate;
