module.exports = function(socket, connections) {
  socket.on('test', function(data) {
    console.log(data);
  });
}
