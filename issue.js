var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
chai.should()

var path = require("path")
var _ = require("lodash")
var mock = require("mock-fs")

var dotty = require("dotty")
var Promise = require("bluebird")
var fsRedux = require("./fs-redux")
var fsExtra = Promise.promisifyAll(require("fs-extra"))
var fs = Promise.promisifyAll(require("fs"))

mock({
  'path/hello-alpha.txt': 'file content here',
  'path/hello-beta.txt': 'file content here'
})

var dstPath = "path/to/fake/dir/"

function wrap(fn){
  return function(){
    return fn()
  }
}

function exportResult(obj, property){
  return function(value){
    dotty.put(obj, property, value)
    return value
  }
}

function provideResult(obj, property){
  return function(){
    return dotty.get(obj, property)
  }
}


function closedThen(srcPath, dstPath){
  dstPath = fsRedux.predictDir(srcPath, dstPath)
  var dstDir = path.dirname(dstPath)
  var values = {}
  return fsRedux.exists(dstPath)
    .then(exportResult(values, "exists"))
    .then(_.partialRight(fsRedux.ifFalseThrow, false, new Error(dstPath+" exists cannot ensure link")))
    .then(wrap(_.bind(fsExtra.mkdirsAsync, fsExtra, dstDir)))
    .then(wrap(_.bind(fsExtra.linkAsync, fsExtra, srcPath, dstPath)))
    .then(provideResult(values, "exists"))
    // continue the chain provide result from exists...
}

function openThen(srcPath, dstPath){
  dstPath = fsRedux.predictDir(srcPath, dstPath)
  var dstDir = path.dirname(dstPath)
  return fsRedux.exists(dstPath)
    .then(_.partialRight(fsRedux.ifFalseThrow, false, new Error(dstPath+" exists cannot ensure link")))
    .then(function(){
      return _.bind(fsExtra.mkdirsAsync, fsExtra, dstDir)()
    })
    .then(function(){
      return _.bind(fsExtra.linkAsync, fsExtra, srcPath, dstPath)()
    })
}

describe("issue", function(){
  describe("closedThen()", function(){
    it("should return then and run promise", function(){
      return closedThen("path/hello-alpha.txt", dstPath).then(function(){
        return fsExtra.readFileAsync("path/to/fake/dir/hello-alpha.txt", "utf8").should.eventually.equal("file content here")
      })
    })
  })
  describe("openThen()", function(){
    it("should return then and run promise", function(){
      return openThen("path/hello-beta.txt", dstPath).then(function(){
        return fsExtra.readFileAsync("path/to/fake/dir/hello-beta.txt", "utf8").should.eventually.equal("file content here")
      })
    })
  })
})
