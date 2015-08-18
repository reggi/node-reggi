var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect

chai.use(chaiAsPromised);


var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs-extra"))

fsPlus = require("../fs-plus")

describe("fs-plus", function(){
  describe("ifFileExistsEnsureLink", function(done){

    beforeEach(function(){
      return Promise.all([
        fs.ensureDirAsync("./fs-plus-safe-zone"),
        fs.writeFileAsync("./fs-plus-safe-zone/example-file.js"),
        fs.mkdirAsync("./fs-plus-safe-zone/links"),
      ])
    })

    afterEach(function(){
      return fs.removeAsync("./fs-plus-safe-zone")
    })

    it("should create file", function(){
      return fsPlus.ifFileExistsEnsureLink("./fs-plus-safe-zone/example-file.js", "./fs-plus-safe-zone/links")
      .then(function(response){
        console.log(response)
        return fsPlus.lstatType("./fs-plus-safe-zone/links/example-file.js")
      })
      .should.eventually.equal("file")
    })

  })
})
