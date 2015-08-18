var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
var mock = require('mock-fs')

chai.use(chaiAsPromised)
chai.should()

var _ = require("underscore")
var lstatType = require("../lstat-type")
var fnAsObjMethod = require("../fn-as-obj-method")
var fnReproduce = require("../fn-reproduce")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))

var lib = {}

lib.ifFileExists = function(thePath){
  return lstatType(thePath).then(function(type){
    if(type == "file") return true
    return false
  })
}

lib.returnPath = function(thePath){
  return thePath
}

lib.logPath = function(thePath){
  console.log(thePath)
}

lib.appendWorld = function(string){
  var result = []
  result.push(string)
  result.push("world")
  return result.join(" ")
}

lib.appendBar = function(string){
  var result = []
  result.push(string)
  result.push("bar")
  return result.join(" ")
}

lib.appendString = function(string, append){
  var result = []
  result.push(string)
  result.push(append)
  return result.join(" ")
}

lib.readFile = fs.readFileAsync

mock({"package.json": "hello"})

describe("fn-reproduce", function(){
  describe("match()", function(){
    it("should build a new function from two functions using fnAsObjMethod()", function(){
      var cloneLib = _.clone(lib)
      var fns = {}
      _.extend(fns, fnAsObjMethod("ifFileExists", lib))
      _.extend(fns, fnAsObjMethod("returnPath", lib))
      _.extend(cloneLib, fnReproduce.match(fns))
      expect(cloneLib).to.have.property("ifFileExistsReturnPath")
      return cloneLib.ifFileExistsReturnPath("package.json").should.eventually.equal("package.json")
    })
    it("should build a new function using buildFn()", function(){
      var cloneLib = _.clone(lib)
      var fns = fnReproduce.buildFn(cloneLib, "ifFileExists", "returnPath")
      _.extend(cloneLib, fnReproduce.match(fns))
      expect(cloneLib).to.have.property("ifFileExistsReturnPath")
      return cloneLib.ifFileExistsReturnPath("package.json").should.eventually.equal("package.json")
    })
    it("should build two new functions using buildFn()", function(){
      var cloneLib = _.clone(lib)
      var fns = fnReproduce.buildFn(cloneLib, ["ifFileExists"], ["returnPath", "logPath"])
      _.extend(cloneLib, fnReproduce.match(fns))
      expect(cloneLib).to.have.property("ifFileExistsReturnPath")
      expect(cloneLib).to.have.property("ifFileExistsLogPath")
      return cloneLib.ifFileExistsReturnPath("package.json").should.eventually.equal("package.json")
    })
  })
  describe("prependArgs()", function(){
    it("should prepend the child args with the value from parent", function(){
      /// Applys lib.appendWorld with the value from fs.readFileAsync
      var cloneLib = _.clone(lib)
      var fns = {}
      _.extend(fns, fnAsObjMethod(fs.readFileAsync, "readFile"))
      _.extend(fns, fnAsObjMethod("appendWorld", lib))
      _.extend(cloneLib, fnReproduce.prependArgs(fns))
      expect(cloneLib).to.have.property("readFileAppendWorld")
      return cloneLib.readFileAppendWorld("package.json", "utf8").should.eventually.equal("hello world")
    })
    it("should build a new function using buildFn()", function(){
      var cloneLib = _.clone(lib)
      var fns = fnReproduce.buildFn(cloneLib, "readFile", "appendWorld")
      _.extend(cloneLib, fnReproduce.prependArgs(fns))
      expect(cloneLib).to.have.property("readFileAppendWorld")
      return cloneLib.readFileAppendWorld("package.json", "utf8").should.eventually.equal("hello world")
    })
    it("should build two new functions using buildFn()", function(){
      var cloneLib = _.clone(lib)
      var fns = fnReproduce.buildFn(cloneLib, ["readFile"], ["appendWorld", "appendBar"])
      _.extend(cloneLib, fnReproduce.prependArgs(fns))
      expect(cloneLib).to.have.property("readFileAppendWorld")
      expect(cloneLib).to.have.property("readFileAppendBar")
      return cloneLib.readFileAppendWorld("package.json", "utf8").should.eventually.equal("hello world")
    })
    it("should build two new functions using buildFn()", function(){
      var cloneLib = _.clone(lib)
      var fns = fnReproduce.buildFn(cloneLib, "readFile", "appendString")
      _.extend(cloneLib, fnReproduce.prependArgs(fns, 2))
      expect(cloneLib).to.have.property("readFileAppendString")
      return cloneLib.readFileAppendString("package.json", "utf8", "world").should.eventually.equal("hello world")
    })
    it("should build two new functions using buildFnMatch()", function(){
      var cloneLib = _.clone(lib)
      var newFn = fnReproduce.buildFnPrependArgs(cloneLib, "readFile", "appendString", 2)
      expect(newFn).to.have.property("readFileAppendString")
      _.extend(cloneLib, newFn)
      expect(cloneLib).to.have.property("readFileAppendString")
      return cloneLib.readFileAppendString("package.json", "utf8", "world").should.eventually.equal("hello world")
    })
  })
  describe("building sync function", function(){
    it("should build new function for itself", function(){
      var cloneLib = _.clone(lib)
      // var fns = fnReproduce.buildFn(cloneLib, ["ifFileExists"], ["returnPath", "logPath"])
      // _.extend(cloneLib, fnReproduce.match(fns))
      var fns = fnReproduce.buildFn(fnReproduce, "buildFn", "match")
      expect(fns[0]).to.have.property("buildFn")
      expect(fns[0]).to.have.property("match")
      expect(fnReproduce).to.have.property("buildFnMatch")
      var newProps = fnReproduce.buildFnMatch(cloneLib, ["ifFileExists"], ["returnPath", "logPath"])
      // yay built sync function!
      expect(newProps).to.have.property("ifFileExistsReturnPath")
      expect(newProps).to.have.property("ifFileExistsLogPath")
    })
  })
})
