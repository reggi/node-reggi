var chai = require("chai")
var expect = chai.expect
var fnAsObjMethod = require("../fn-as-obj-method")

var anon = {}

anon.ifHappy = function(str){
  if(str == "happy") return true
  return false
}

var known = {}

known.ifHappy = function ifHappy(str){
  if(str == "happy") return true
  return false
}

function ifHappy(str){
  if(str == "happy") return true
  return false
}

var ifHappyAnon = function(str){
  if(str == "happy") return true
  return false
}

describe("fn-as-obj-method", function(){

  describe("anon object prop passed as function", function(){

    it("should throw error", function(){
      expect(function(){
        return fnAsObjMethod(anon.ifHappy)
      }).to.throw()
    })

    it("should return expected", function(){
      expect(function(){
        return fnAsObjMethod(anon.ifHappy, "ifHappy")
      }).to.not.throw()
      var result = fnAsObjMethod(anon.ifHappy, "ifHappy")
      expect(result).to.have.property("ifHappy", anon.ifHappy)
    })

  })

  describe("anon object prop passed as object", function(){

    it("should return expected", function(){
      expect(function(){
        return fnAsObjMethod("ifHappy", anon)
      }).to.not.throw()
      var result = fnAsObjMethod("ifHappy", anon)
      expect(result).to.have.property("ifHappy", anon.ifHappy)
    })

  })

  describe("known object prop passed as function", function(){

    it("should return expected", function(){
      expect(function(){
        return fnAsObjMethod(known.ifHappy)
      }).to.not.throw()
      var result = fnAsObjMethod(known.ifHappy)
      expect(result).to.have.property("ifHappy", known.ifHappy)
    })

  })

  describe("known object prop passed as object", function(){

    it("should return expected", function(){
      expect(function(){
        return fnAsObjMethod("ifHappy", known)
      }).to.not.throw()
      var result = fnAsObjMethod("ifHappy", known)
      expect(result).to.have.property("ifHappy", known.ifHappy)
    })

  })

  describe("anon function", function(){

    it("should throw error", function(){
      expect(function(){
        return fnAsObjMethod(ifHappyAnon)
      }).to.throw()
    })

    it("should return expected", function(){
      expect(function(){
        return fnAsObjMethod(ifHappyAnon, "ifHappy")
      }).to.not.throw()
      // console.log(ifHappyAnon)
      var result = fnAsObjMethod(ifHappyAnon, "ifHappy")
      expect(result).to.have.property("ifHappy", ifHappyAnon)
    })

  })

  describe("known function", function(){

    it("should return expected", function(){
      expect(function(){
        return fnAsObjMethod(ifHappy, "ifHappy")
      }).to.not.throw()
      var result = fnAsObjMethod(ifHappy, "ifHappy")
      expect(result).to.have.property("ifHappy", ifHappy)
    })

  })

})


//
// var x = standardizeFunctionName(libx.ifHappy)
// console.log(x)
// var x = standardizeFunctionName(ifHappy)
// console.log(x)
// var x = standardizeFunctionName("ifHappy", lib)
// console.log(x)
// var x = standardizeFunctionName(ifHappyAnon, "ifHappy")
// console.log(x)
