var mock = require('mock-fs')
var Promise = require("bluebird")
var fsExists = require("../fs-exists")
var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
chai.should()

describe("fs-exists", function(){
  before(function(){
    mock({
      'path/hello.txt': 'file content here',
      'path/bar.txt': 'file content here'
    })
  })
  after(function() {
    mock.restore()
  })
  it("should return true if file exists", function(){
    return fsExists('path/hello.txt').should.eventually.equal(true)
  })
  it("should return false if file exists", function(){
    return fsExists('path/missing.txt').should.eventually.equal(false)
  })
})
