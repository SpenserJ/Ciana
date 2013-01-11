var nconf = require('nconf');

nconf.argv()
     .env()
     .file('./config.json');

nconf.defaults({
  'port': '3000'
});
nconf.set('app_path', __dirname + '/..');

module.exports = nconf;
