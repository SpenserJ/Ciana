var Collector = require('../lib/provider/collector');

var Server = Collector.extend({
  toString: 'ProviderRandom',
  name: 'random',
  default_settings: {
    frequency: 5,
  },
  tick: function tick() {
    this.emit({ random: Math.random() * 100 });
  }
});

var Client = {
  scripts: [
    '//cdnjs.cloudflare.com/ajax/libs/d3/3.1.6/d3.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/rickshaw/1.2.1/rickshaw.min.js',
  ],

  graph: {
    data: {
      series: [{ data: [] }]
    },
  },
  formatAs: {
    graph: function(data) {
      this.graph.data.series[0].data.push({ x: this.graph.data.series[0].data.length, y: data.random });
      if (typeof this.graph.rickshaw === 'undefined') {
        // First run
        var element = document.querySelector('#' + this.panel + ' .graph');
        if (element === null) {
          return;
        }
        element.parentNode.style.overflow = 'hidden';
        var graph_data = {
          element: element,
          render: 'line',
          series: this.graph.data.series
        };
        this.graph.rickshaw = new Rickshaw.Graph(graph_data);
        panels[this.panel].redrawPanel(false);
      } else {
        this.graph.rickshaw.update();
      }
    }
  }
};

module.exports.Server = Server;
module.exports.Client = Client;
