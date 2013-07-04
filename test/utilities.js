var should = require('should')
  , Utilities = require('../lib/utilities');

describe("Utilities", function() {
  it('Should convert an object with functions into a string', function(done) {
    var input = {
        key1: function (arg) { return arg; },
        key2: function NamedFunction(arg) { return arg; }
      }
      , match = {
        key1: 'function (arg) { return arg; }',
        key2: 'function NamedFunction(arg) { return arg; }'
      }
      , stringified = Utilities.recursiveStringifyFunctions(input);

    stringified.should.eql(match);
    done();
  });

  it('Should recursively convert an object with functions into a string', function(done) {
    var input = {
        key1: [function (arg) { return arg; }],
        key2: { child: function NamedFunction(arg) { return arg; } }
      }
      , match = {
        key1: ['function (arg) { return arg; }'],
        key2: { child: 'function NamedFunction(arg) { return arg; }' }
      }
      , stringified = Utilities.recursiveStringifyFunctions(input);

    stringified.should.eql(match);
    done();
  });
});
