var Promise = require("bluebird")
var _ = require("lodash")
var mock = require('mock-fs')
var fs = Promise.promisifyAll(require("fs"))
var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

mock({
  'path/hello.txt': 'file content here'
});

describe("issue using fs promisifiedAll", function(){
  describe("fs.readFileAsync()", function(){
    it("should be a funciton", function(){
      expect(fs.readFileAsync).to.be.instanceof(Function)
    })
    it("should use mock-fs", function(){
      return fs.readFileAsync("path/hello.txt", "utf8").should.eventually.equal("file content here")
    })
  })
  describe("_.partial()", function(){
    it("should return function", function(){
      var readFile = _.partial(fs.readFileAsync, "path/hello.txt", "utf8")
      expect(readFile).to.be.instanceof(Function)
    })
    it("should create promise", function(){
      var readFile = _.partial(fs.readFileAsync, "path/hello.txt", "utf8")
      return readFile().should.eventually.equal("file content here")
    })
  })
})

var dummyPromise = function(){
  return Promise.resolve("file content here")
}

describe("issue using dummy promise", function(){
  describe("dummyPromise()", function(){
    it("should be a funciton", function(){
      expect(dummyPromise).to.be.instanceof(Function)
    })
    it("should use mock-fs", function(){
      return dummyPromise("path/hello.txt", "utf8").should.eventually.equal("file content here")
    })
  })
  describe("_.partial()", function(){
    it("should return function", function(){
      var readFile = _.partial(dummyPromise, "path/hello.txt", "utf8")
      expect(readFile).to.be.instanceof(Function)
    })
    it("should create promise", function(){
      var readFile = _.partial(dummyPromise, "path/hello.txt", "utf8")
      return readFile().should.eventually.equal("file content here")
    })
  })
})

var dummyCallback = function(path, encoding, cb){
  return cb(null, "file content here")
}

var dummyPromisified = Promise.promisify(dummyCallback)

describe("issue using dummy promisify", function(){
  describe("dummyPromisified()", function(){
    it("should be a funciton", function(){
      expect(dummyPromisified).to.be.instanceof(Function)
    })
    it("should use mock-fs", function(){
      return dummyPromisified("path/hello.txt", "utf8").should.eventually.equal("file content here")
    })
  })
  describe("_.partial()", function(){
    it("should return function", function(){
      var readFile = _.partial(dummyPromisified, "path/hello.txt", "utf8")
      expect(readFile).to.be.instanceof(Function)
    })
    it("should create promise", function(){
      var readFile = _.partial(dummyPromisified, "path/hello.txt", "utf8")
      return readFile().should.eventually.equal("file content here")
    })
  })
})

var lib = {}

lib.dummy = function(path, encoding, cb){
  return cb(null, "file content here")
}

Promise.promisifyAll(lib)

describe("issue using dummy promisifyAll", function(){
  describe("lib.dummyAsync()", function(){
    it("should be a funciton", function(){
      expect(lib.dummyAsync).to.be.instanceof(Function)
    })
    it("should use mock-fs", function(){
      return lib.dummyAsync("path/hello.txt", "utf8").should.eventually.equal("file content here")
    })
  })
  describe("_.partial()", function(){
    it("should return function", function(){
      var readFile = _.partial(lib.dummyAsync, "path/hello.txt", "utf8")
      expect(readFile).to.be.instanceof(Function)
    })
    it("should create promise", function(){
      var readFile = _.partial(lib.dummyAsync, "path/hello.txt", "utf8")
      return readFile().should.eventually.equal("file content here")
    })
  })
})

var libq = {}

libq.dummy = function(path, encoding){
  return Promise.resolve("file content here")
}

describe("issue using dummy lib promise", function(){
  describe("libq.dummy()", function(){
    it("should be a funciton", function(){
      expect(libq.dummy).to.be.instanceof(Function)
    })
    it("should use mock-fs", function(){
      return libq.dummy("path/hello.txt", "utf8").should.eventually.equal("file content here")
    })
  })
  describe("_.partial()", function(){
    it("should return function", function(){
      var readFile = _.partial(libq.dummy, "path/hello.txt", "utf8")
      expect(readFile).to.be.instanceof(Function)
    })
    it("should create promise", function(){
      var readFile = _.partial(libq.dummy, "path/hello.txt", "utf8")
      return readFile().should.eventually.equal("file content here")
    })
  })
})
