var lodash = require("lodash")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))
var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

var mock = require('mock-fs')
// this needs to be after mock-fs and before the mock() call
var fsRedux = require("../fs-redux")

mock({
  'path/hello.txt': 'file content here'
});

describe("fs-redux", function(){
  describe("exists()", function(){
    it("should return exists", function(){
      return fsRedux.exists('path/hello.txt').should.eventually.equal(true)
    })
    it("should throw error", function(){
      return fsRedux.exists('path/missing.txt').should.eventually.equal(false)
    })
  })
  describe("ifExists()", function(){
    it("should return exists", function(){
      return fsRedux.ifExists('path/hello.txt').should.eventually.equal(true)
    })
    it("should throw error", function(){
      return fsRedux.ifExists('path/missing.txt').should.be.rejectedWith(Error)
    })
    it("should return exists false", function(){
      return fsRedux.ifExists('path/missing.txt', false).should.eventually.equal(false)
    })
    it("should return exists false", function(){
      return fsRedux.ifExists('path/hello.txt', false).should.be.rejectedWith(Error)
    })
  })
  describe("type()", function(){
    it("should return type", function(){
      return fsRedux.type('path/hello.txt').should.eventually.equal("file")
    })
    it("should throw error", function(){
      return fsRedux.type('path/missing.txt').should.be.rejectedWith(Error)
    })
  })
  describe("ifType()", function(){
    it("should return type", function(){
      return fsRedux.ifType('path/hello.txt', "file").should.eventually.equal("file")
    })
    it("should throw error", function(){
      return fsRedux.ifType('path/hello.txt', "directory").should.be.rejectedWith(Error)
    })
  })
  describe("predictPath()", function(){
    it("should predict path", function(){
      var path = fsRedux.predictPath("test/lib.js", "my-module")
      expect(path).to.equal("my-module/test/lib.js")
    })
    it("should merge dirs with parent", function(){
      var path = fsRedux.predictPath("parent/test/lib.js", "parent/my-module")
      expect(path).to.equal("parent/my-module/test/lib.js")
    })
    it("should merge dirs with output", function(){
      var path = fsRedux.predictPath("parent/test/lib.js", "parent/my-module/test/lib.js")
      expect(path).to.equal("parent/my-module/test/lib.js")
    })
    it("should merge dirs with up dir", function(){
      var path = fsRedux.predictPath("parent/test/lib.js", "parent/my-module/test")
      expect(path).to.equal("parent/my-module/test/lib.js")
    })
    it("should merge dirs with up dir", function(){
      var path = fsRedux.predictPath("parent/test/lib.js", "parent/my-module/hello.js")
      expect(path).to.equal("parent/my-module/hello.js/test/lib.js")
    })
  })
  describe("predictDir()", function(){
    it("should predict path", function(){
      var path = fsRedux.predictDir("test/lib.js", "my-module")
      expect(path).to.equal("my-module/test/lib.js")
    })
    it("should merge dirs with parent", function(){
      var path = fsRedux.predictDir("parent/test/lib.js", "parent/my-module")
      expect(path).to.equal("parent/my-module/test/lib.js")
    })
    it("should merge dirs with output", function(){
      var path = fsRedux.predictDir("parent/test/lib.js", "parent/my-module/test/lib.js")
      expect(path).to.equal("parent/my-module/test/lib.js")
    })
    it("should merge dirs with up dir", function(){
      var path = fsRedux.predictDir("parent/test/lib.js", "parent/my-module/test")
      expect(path).to.equal("parent/my-module/test/lib.js")
    })
    it("should predict path", function(){
      var path = fsRedux.predictDir("parent/test/lib.js", "parent/my-module/hello.js")
      expect(path).to.equal("parent/my-module/hello.js")
    })
  })
  describe("ensureLink()", function(){
    // it("should make link", function(){
    //   return fsRedux.ensureLink("path/hello.txt", "path/to/fake/dir/").then(function(){
    //     return fs.readFileAsync("path/to/fake/dir/hello.txt", "utf8").should.eventually.equal("file content here")
    //   })
    // })
    it("should make link", function(done){
      return fsRedux.expEnsureLink("path/hello.txt", "path/to/fake/dir/").then(function(val){
        console.log(val)
        return val
        // return fs.readFileAsync("path/to/fake/dir/hello.txt", "utf8").should.eventually.equal("file content here").notify(done)
      })
    })
  })
//   describe("experimental", function(){
//     it("should augment function", function(){
//       var exists = lodash.partial(fsRedux.exists, "path/hello.txt")
//       return exists().should.eventually.equal(true)
//     })
//     it("should augment function with arguments passed", function(){
//       var exists = lodash.partial(fsRedux.exists, "path/hello.txt")
//       return exists("path/missing.txt").should.eventually.equal(true)
//     })
//   })
})
