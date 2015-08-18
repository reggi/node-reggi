var chai = require("chai")
var expect = chai.expect

var fnWithNameProp = require("../fn-with-name-prop")

describe("fn-with-name-prop", function(){
  it("should have prop when passed object with one method", function(){
    var fn = fnWithNameProp({hello: function(){}})
    expect(fn).to.be.instanceof(Function)
    expect(fn).to.have.property("_name", "hello")
  })
  it("should have name prop when passed string anon func", function(){
    var fn = fnWithNameProp(function(){}, "hello")
    expect(fn).to.be.instanceof(Function)
    expect(fn).to.have.property("_name", "hello")
  })
  it("should have name prop when passed known func", function(){
    var fn = fnWithNameProp(function hello(){})
    expect(fn).to.be.instanceof(Function)
    expect(fn).to.have.property("_name", "hello")
  })
  it("should have name prop when passed assigned named func", function(){
    var lib = function hello(){}
    var fn = fnWithNameProp(lib)
    expect(fn).to.be.instanceof(Function)
    expect(fn).to.have.property("_name", "hello")
  })
  it("should have name prop when passed anon object method", function(){
    var lib = {}
    lib.hello = function(){}
    var fn = fnWithNameProp("hello", lib)
    expect(fn).to.be.instanceof(Function)
    expect(fn).to.have.property("_name", "hello")
  })
  it("should have name prop when passed named object method", function(){
    var lib = {}
    lib.hello = function hello(){}
    var fn = fnWithNameProp("hello", lib)
    expect(fn).to.be.instanceof(Function)
    expect(fn).to.have.property("_name", "hello")
  })
})
