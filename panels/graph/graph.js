module.exports = {
  bindingHandlers: {
    graph: {
      init: function(element, valueAccessor) {
        var panel = ko.utils.unwrapObservable(valueAccessor()); // Get the current value of the current property we're bound to
        element.parentNode.style.overflow = 'hidden';
        panel.provider_object().graph.data.element = element;
        panel.provider_object().graph.rickshaw = new Rickshaw.Graph(panel.provider_object().graph.data);
        if (panel.provider_object().graph.stacked !== true) {
          panel.provider_object().graph.rickshaw.renderer.unstack = true;
        }
        panel.provider_object().graph.rickshaw.render();
      }
    }
  }
};
