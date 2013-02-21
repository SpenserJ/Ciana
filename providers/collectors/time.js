var Plugin_Time = function() {
  
}

Plugin_Time.prototype.get = function() {
  return { text: new Date() };
}

module.exports = Plugin_Time;
