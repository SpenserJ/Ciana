module.exports = {
  bindingHandlers: {
    graph: {
      init: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()); // Get the current value of the current property we're bound to
        console.log(element);
        console.log(value);
      }
    }
  }
};
