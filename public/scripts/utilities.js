function recursiveUnstringifyFunctions(input) {
  var i;
  if (typeof input === 'string' && input.substring(0, 9) === 'function ') {
    /*jslint evil: true */
    input = new Function('return (' + input + ')')();
  } else if (input instanceof Array) {
    for (i = 0; i < input.length; i++) {
      input[i] = recursiveUnstringifyFunctions(input[i]);
    }
  } else if (input instanceof Object) {
    var keys = Object.keys(input);
    for (i = 0; i < keys.length; i++) {
      input[keys[i]] = recursiveUnstringifyFunctions(input[keys[i]]);
    }
  }
  return input;
}
