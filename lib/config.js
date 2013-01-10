var nconf = require('nconf');

nconf.argv()
     .env()
     .file('./config.json');

nconf.defaults({
  'port': '3000'
});

module.exports = nconf;
