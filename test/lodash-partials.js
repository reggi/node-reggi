var chai = require("chai")
var expect = chai.expect
var _ = require("lodash")

var greet = function(greeting, name) {
  return greeting + ' ' + name;
}

describe("lodash", function(){
  describe("partial()", function(){
    it("should return greeting called with only apply name", function(){
      var sayHelloTo = _.partial(greet, 'hello')
      expect(sayHelloTo('fred')).to.equal("hello fred")
    })
    it("should return greeting called with only name using placeholders", function(){
      var greetFred = _.partial(greet, _, 'fred')
      expect(greetFred('hi')).to.equal("hi fred")
    })
    it("should allow for empty fn call", function(){
      var greet = function(greeting) {
        return greeting;
      }
      var greetHello = _.partial(greet, 'hello')
      expect(greetHello()).to.equal("hello")
    })
  })
  describe("partialRight()", function(){
    it("should return greeting if call with only greeting", function(){
      var greetFred = _.partialRight(greet, 'fred')
      expect(greetFred('hi')).to.equal("hi fred")
    })
    it("should return greeting called with with only greeting using placeholders", function(){
      var sayHelloTo = _.partialRight(greet, 'hello', _);
      expect(sayHelloTo('fred')).to.equal("hello fred")
    })
  })
})
