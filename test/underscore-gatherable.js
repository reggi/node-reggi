var chai = require("chai")
var expect = chai.expect

var _ = require("underscore")
_.mixin(require("../underscore-gatherable"))

var middleware = _.makeGatherable()

middleware.next = function(){
  return function(req, res, next){
    return "next"
  }
}

middleware.json = function(){
  return function(req, res, next){
    return "json"
  }
}

_.extendGatherable(middleware)

describe("underscore-gatherable", function(){
  it("should work with direct function calls", function(){

    var use = [
      middleware.next(),
      middleware.json()
    ]

    expect(use).to.be.instanceof(Array)
    expect(use).to.have.length(2)
    expect(use[0]).to.be.instanceof(Function)
    expect(use[0]()).to.equal("next")
    expect(use[1]).to.be.instanceof(Function)
    expect(use[1]()).to.equal("json")

  })
  it("should work with gathered function calls", function(){

    var use = middleware.gather()
      .next()
      .json()
      .value()

    expect(use).to.be.instanceof(Array)
    expect(use).to.have.length(2)
    expect(use[0]).to.be.instanceof(Function)
    expect(use[0]()).to.equal("next")
    expect(use[1]).to.be.instanceof(Function)
    expect(use[1]()).to.equal("json")

  })
})
