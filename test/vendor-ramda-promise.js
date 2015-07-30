var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
chai.should()

var R = require("ramda")

var alpha = function(str){
  var value = [str, "alpha"].join(" ")
  return Promise.resolve(value)
}
var beta = function(str){
  var value = [str, "beta"].join(" ")
  return Promise.resolve(value)
}
var gamma = function(str){
  var value = [str, "gamma"].join(" ")
  return Promise.resolve(value)
}
var delta = function(str){
  var value = [str, "delta"].join(" ")
  return Promise.resolve(value)
}
var alphaDuo = function(valueOne, valueTwo){
  var value = [valueOne, valueTwo, "alpha"].join(" ")
  return Promise.resolve(value)
}
var betaDuo = function(valueOne, valueTwo){
  var value = [valueOne, valueTwo, "beta"].join(" ")
  return Promise.resolve(value)
}
var gammaDuo = function(valueOne, valueTwo){
  var value = [valueOne, valueTwo, "gamma"].join(" ")
  return Promise.resolve(value)
}
var deltaDuo = function(valueOne, valueTwo){
  var value = [valueOne, valueTwo, "delta"].join(" ")
  return Promise.resolve(value)
}

describe("vendor-ramda-promise", function(){
  it("should pipe where each promise has one arg", function(){
    var result = R.pipeP(
      alpha,
      beta,
      gamma,
      delta
    )
    result("A").should.eventually.equal("A alpha beta gamma delta")
  })
  it("should pipe where first promise has two args", function(){
    var result = R.pipeP(
      alphaDuo,
      beta,
      gamma,
      delta
    )
    result("A", "B").should.eventually.equal("A B alpha beta gamma delta")
  })
  it("should pipe where second promise has two args", function(){
    var result = R.pipeP(
      alpha,
      R.curry(betaDuo)("B"),
      gamma,
      delta
    )
    result("A").should.eventually.equal("A alpha B beta gamma delta")
  })
  it("should pipe where all promisees have two args", function(){
    var result = R.pipeP(
      alphaDuo,
      R.curry(betaDuo)("C"),
      R.curry(gamma)("D"),
      R.curry(delta)("E")
    )
    result("A", "B").should.eventually.equal("A B alpha C beta D gamma E delta")
  })
})
