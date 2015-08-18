var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var mock = require('mock-fs');

chai.use(chaiAsPromised);
chai.should()

mock({
  'path/to/fake/dir': {
    'package.json': JSON.stringify({"name": "fake"}, null , 2),
  },
  'symlink-package.json': mock.symlink({
    path: 'path/to/fake/dir/package.json'
  })
});

var lstatType = require("../lstat-type")

describe("lstat-type", function(){
  it("should return file", function(){
    return lstatType("path/to/fake/dir/package.json").should.eventually.equal("file")
  })
  it("should return directory", function(){
    return lstatType("path/to/fake/dir").should.eventually.equal("directory")
  })
  it("should return symbolicLink", function(){
    return lstatType("symlink-package.json").should.eventually.equal("symbolicLink")
  })
})
