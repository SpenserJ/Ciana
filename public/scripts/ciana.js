var socket = io.connect();
socket.on('provider_update', function (data) {
  var $panel = $('#' + data.name);
  $('.content', $panel).html(data.data);
  console.log('provider_update', data);
});
socket.on('initialize', function (data) {
  console.log('initialize', data);
});
