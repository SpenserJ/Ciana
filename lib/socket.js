module.exports = function(socket) {
  socket.on('test', function(data) {
    console.log(data);
  });
}
