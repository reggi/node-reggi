var chai = require("chai")
var expect = chai.expect

var mock = require("mock-fs")

var fs = require("fs")
var ensureSymlink = require("../ensure-symlink").ensureSymlink

describe("ensure-symlink", function(){
  // beforeEach(function(){
  //   mock({
  //     'file.txt': 'file content\n',
  //     'empty-dir': {}
  //   })
  // })
  // afterEach(function() {
  //   mock.restore()
  // })
  it("should create new file symlink in root", function(done){
    return ensureSymlink("file.txt", "symlink.txt", function(err){
      if(err) return done(err)
      expect(fs.readdirSync("./")).to.contain("symlink.txt")
      expect(fs.lstatSync("symlink.txt").isSymbolicLink()).to.equal(true)
      expect(fs.readFileSync("symlink.txt", "utf8")).to.equal("file content\n")
      done()
    })
  })
  it("should create new file symlink in folder", function(done){
    return ensureSymlink("file.txt", "empty-dir/symlink.txt", function(err){
      if(err) return done(err)
      expect(fs.readdirSync("empty-dir")).to.contain("symlink.txt")
      expect(fs.lstatSync("empty-dir/symlink.txt").isSymbolicLink()).to.equal(true)
      // expect(fs.readFileSync("empty-dir/symlink.txt", "utf8")).to.equal("file content")
      done()
    })
  })
})
