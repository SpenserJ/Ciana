var Plugin_Time = require('../lib/plugin/collector');

Plugin_Time.prototype.defaults = {
  frequency: 1
}

Plugin_Time.prototype.tick = function() {
  console.log({ text: new Date() });
}

module.exports = Plugin_Time;
