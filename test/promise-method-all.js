var Promise = require("bluebird")
var chai = require("chai")
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect
chai.should()

var promiseMethodAll = require("../promise-method-all.js")

// start pre-req

var concat = function(one, two){
  return Promise.resolve(one + " " + two)
}

var deep = {}

deep.authorize = function(unauthorized){
  return function(name, rank){
    if(name == unauthorized) throw new Error(unauthorized + " unauthorized")
    return concat(name, rank)
  }
}

deep.notDeep = function(name, rank){
  if(name == "tom") throw new Error("tom unauthorized")
  return concat(name, rank)
}

var normal = {}

normal.authorize = function(name, rank){
  if(name == "tom") throw new Error("tom unauthorized")
  return concat(name, rank)
}

// end pre-req

describe("promise-method-all.js", function(){

  describe("function", function(){
    it("should throw error", function(){
      expect(function(){
        return normal.authorize("tom", "rank")
      }).to.throw("tom unauthorized")
    })
  })

  describe("function deep", function(){
    it("should throw error", function(){
      expect(function(){
        return deep.authorize("tom")("tom", "developer")
      }).to.throw("tom unauthorized")
    })
  })

  describe("promise method", function(){
    it("should reject with error", function(done){
      Promise.method(normal.authorize)("tom", "rank").should.eventually.be.rejectedWith("tom unauthorized").notify(done)
    })
    it("should return value", function(done){
      Promise.method(normal.authorize)("felix", "rank").should.eventually.be.equal("felix rank").notify(done)
    })
  })

  describe("promise method deep", function(){
    it("should reject with error", function(done){
      Promise.method(deep.authorize("tom"))("tom", "rank").should.eventually.be.rejectedWith("tom unauthorized").notify(done)
    })
    it("should return value", function(done){
      Promise.method(deep.authorize("tom"))("felix", "rank").should.eventually.be.equal("felix rank").notify(done)
    })
  })

  describe("promise method all", function(){
    it("should reject with error", function(done){
      promiseMethodAll(normal).authorize("tom", "developer").should.eventually.be.rejectedWith("tom unauthorized").notify(done)
    })
    it("should return value", function(done){
      promiseMethodAll(normal).authorize("felix", "rank").should.eventually.be.equal("felix rank").notify(done)
    })
  })

  describe("promise method all deep", function(){
    it("should reject with error", function(done){
      promiseMethodAll(deep, true).authorize("tom")("tom", "developer").should.eventually.be.rejectedWith("tom unauthorized").notify(done)
    })
    it("should return value", function(done){
      promiseMethodAll(deep, true).authorize("tom")("felix", "rank").should.eventually.be.equal("felix rank").notify(done)
    })
  })

  describe("promise method all deep with not deep", function(){
    it("should reject with error", function(done){
      promiseMethodAll(deep, true).notDeep()("tom", "developer").should.eventually.be.rejectedWith("tom unauthorized").notify(done)
    })
    it("should return value", function(done){
      promiseMethodAll(deep, true).notDeep()("felix", "rank").should.eventually.be.equal("felix rank").notify(done)
    })
  })

})
