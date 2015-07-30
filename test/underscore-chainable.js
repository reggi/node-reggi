var chai = require("chai")
var expect = chai.expect

var _ = require("underscore")
_.mixin(require("../underscore-chainable"))

var cat = _.makeChainable() // make the `cat` object chainable

cat.eat = function(food){
  if(food == "tuna") return 95
  if(food == "milk") return 35
  return 0
}

cat.play = function(energy){
  if(energy < 50) return 0
  return 100
}

_.extendChainable(cat) // extend the chainablity

describe("underscore-chainable", function(){
  it("should still retain function method values", function(){
    var energy  = cat.eat("tuna")
    var status = cat.play(energy)
    expect(status).to.equal(100)
  })
  it("should still be chainable", function(){
    var status = cat
      .chain("tuna")
      .eat()
      .play()
      .value()
    expect(status).to.equal(100)
  })
})
