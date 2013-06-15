var Screen = require('./screen').Screen;

module.exports = function(ciana, socket) {
  console.log('Handling socket');

  socket.on('initialize', function(data) {
    var firstRun = false, i;
    if (typeof ciana.screens[data.screen] === 'undefined') {
      ciana.screens[data.screen] = new Screen(ciana, data.screen);
      firstRun = true;
    }
    var screen = ciana.screens[data.screen];
    socket.emit('templates', screen.layout.templates_client);
    socket.emit('panels', screen.panels);
    socket.emit('provider_mixins', screen.provider_mixins);
    var provider_names = Object.keys(screen.providers), provider;
    for (i = 0; i < provider_names.length; i++)  {
      provider = screen.providers[provider_names[i]];
      socket.emit('provider_setting', {
        provider: provider.name,
        panel: provider.panel_name,
        settings: provider.settings
      });
      if (firstRun !== true) {
        provider.reemit_last(socket);
      }
    }
  });
};
