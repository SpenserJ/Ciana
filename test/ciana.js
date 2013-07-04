var should = require('should')
  , Ciana = require('../lib/ciana')
  , io = require('socket.io-client');

var ciana
  , socket_options = {
      'force new connection': true,
      'connect timeout': 1500,
      'transports': ['websocket'],
      'try multiple transports': false
    };

describe("Ciana", function() {
  before(function(done) {
    ciana = new Ciana();
    ciana.start();
    done();
  });

  it('Should accept websocket connections', function(done) {
    var client = io.connect('http://0.0.0.0:3000', socket_options);
    client.on('connect', done);
    client.on('error', function(error) {
      done(new Error(error));
    });
  });
});
