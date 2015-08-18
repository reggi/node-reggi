var chai = require("chai")
var expect = chai.expect

var pathRoot = require("../path-root")

describe("path-root", function(){
  it("should work as expected", function(){
    // expect(pathRoot("hello.txt", "foo/bar")).to.equal("foo/bar/hello.txt")
    // expect(pathRoot("/hello.txt", "/foo/bar")).to.equal("/foo/bar/hello.txt")
    // expect(pathRoot("/hello.txt", "foo/bar")).to.equal("foo/bar/hello.txt")
    // expect(pathRoot("hello.txt", "/foo/bar")).to.equal("/foo/bar/hello.txt")
    // expect(pathRoot("test/hello.txt", "test/foo/bar")).to.equal("test/foo/bar/hello.txt")
    // expect(pathRoot("Users/thomas/Desktop/hello.txt", "foo/bar")).to.equal("Users/thomas/Desktop/foo/bar/hello.txt")
    // expect(pathRoot("/Users/thomas/Desktop/hello.txt", "foo/bar")).to.equal("/Users/thomas/Desktop/foo/bar/hello.txt")
  })
})

// pathroot("./file.js", "./tests/file.js").to.equal("tests/file.js")
// pathroot("./file.js", "./tests/").to.equal("tests/file.js")
// pathroot("./file.js", "./tests").to.equal("tests/file.js")
//
// pathroot("file.js", "./tests/file.js").to.equal("tests/file.js")
// pathroot("file.js", "./tests/").to.equal("tests/file.js")
// pathroot("file.js", "./tests").to.equal("tests/file.js")
//
// pathroot("file.js", "tests/file.js").to.equal("tests/file.js")
// pathroot("file.js", "tests/").to.equal("tests/file.js")
// pathroot("file.js", "tests").to.equal("tests/file.js")
//
// pathroot("file.js", "tests/").to.equal("tests/file.js")
// pathroot("file.js", "tests").to.equal("tests/file.js")
// pathroot("/file.js", "./tests/file.js").to.equal("tests/file.js")
// pathroot("/file.js", "./tests/").to.equal("tests/file.js")

// "./file.js", "./test/file.js"
