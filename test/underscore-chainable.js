var chai = require("chai")
var expect = chai.expect

var _ = require("underscore")
_.mixin(require("../underscore-chainable"))

var cat = _.makeChainable()

cat.eat = function(food){
  if(food == "tuna") return 95
  if(food == "milk") return 35
  return 0
}

cat.play = function(energy){
  if(energy < 50) return 0
  return 100
}

_.extendChainable(cat)

describe("underscore-chainable", function(){
  it("should work with direct function calls", function(){

    var food = "tuna"
    var energy  = cat.eat(food)
    var status = cat.play(energy)

    expect(status).to.equal(100)

  })
  it("should work with chained function calls", function(){

    var status = cat.chain("tuna")
      .eat()
      .play()
      .value()

    expect(status).to.equal(100)

  })
})
