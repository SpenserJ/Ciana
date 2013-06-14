var Screen = require('./screen').Screen;

module.exports = function(ciana, socket) {
  console.log('Handling socket');

  socket.on('initialize', function(data) {
    var firstRun = false;
    if (typeof ciana.screens[data.screen] === 'undefined') {
      ciana.screens[data.screen] = new Screen(ciana, data.screen);
      firstRun = true;
    }
    var screen = ciana.screens[data.screen];
    socket.emit('templates', screen.layout.templates);
    socket.emit('panels', screen.panels);
    socket.emit('provider_to', screen.provider_templates);
    if (firstRun !== true) {
      var provider_names = Object.keys(screen.providers), i;
      for (i = 0; i < provider_names.length; i++)  {
        screen.providers[provider_names[i]].reemit_last(socket);
      }
    }
  });
};
