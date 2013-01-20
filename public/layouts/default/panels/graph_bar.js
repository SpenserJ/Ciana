function PanelType_graph_bar(panel, data) {
  console.log(data);
  var categories = Object.keys(data.data)
    , series = [];
  $.each(data.data, function(key, value) {
    series.push(data.data[key].open);
  });
  chart_bar = new Highcharts.Chart({
    chart: {
      renderTo: $('#' + panel.name + ' .content')[0],
      defaultSeriesType: 'bar'
    },
    xAxis: {
      categories: categories
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    colors: ['#EFEFEF'],
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '' + this.x + ': ' + this.y + ' mm';
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{ name: 'Mark', data: series }]
  });
}
