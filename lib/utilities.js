var Utilities = {
  recursiveStringifyFunctions: function recursiveStringifyFunctions(input) {
    var i;
    if (input instanceof Array) {
      for (i = 0; i < input.length; i++) {
        input[i] = this.recursiveStringifyFunctions(input[i]);
      }
    } else if (input instanceof Function) {
      input = input.toString();
    } else if (input instanceof Object) {
      var keys = Object.keys(input);
      for (i = 0; i < keys.length; i++) {
        input[keys[i]] = this.recursiveStringifyFunctions(input[keys[i]]);
      }
    }
    return input;
  }
};

module.exports = Utilities;
