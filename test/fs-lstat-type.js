var mock = require('mock-fs')
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))
var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
chai.should()

var fsStats = require("../fs-stats")

describe("fs-stats", function(){
  before(function(){
    mock({
      'some/dir': mock.directory({
        mode: 0755,
        items: {
          file1: 'file one content',
          file2: new Buffer([8, 6, 7, 5, 3, 0, 9])
        }
      }),
      'path/hello.txt': 'file content here',
      'regular-file': 'file contents',
      'a-symlink': mock.symlink({
        path: 'regular-file'
      })
    })
  })
  after(function() {
    mock.restore()
  })
  it("should return type file", function(){
    return fs.lstatAsync('path/hello.txt').then(fsStats).should.eventually.equal("file")
  })
  it("should return type symbolicLink", function(){
    return fs.lstatAsync('a-symlink').then(fsStats).should.eventually.equal("symbolicLink")
  })
  it("should return type directory", function(){
    return fs.lstatAsync('some/dir').then(fsStats).should.eventually.equal("directory")
  })
})
