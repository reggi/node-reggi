var chai = require("chai")
var expect = chai.expect
var fnThrow = require("../fn-throw")

describe("fn-throw", function(){
  it("should throw an error with error object & string", function(){
    expect(fnThrow(Error, "alpha")).to.throw(Error, "alpha")
  })
  it("should throw an error with error instance", function(){
    expect(fnThrow(new Error("beta"))).to.throw(Error, "beta")
  })
  it("should throw an error with string", function(){
    expect(fnThrow("gamma")).to.throw(Error, "gamma")
  })
})
