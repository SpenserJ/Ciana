var socket = io.connect();
socket.on('provider_update', function (data) {
  console.log('provider_update', data);
});
socket.on('initialize', function (data) {
  console.log('initialize', data);
});
