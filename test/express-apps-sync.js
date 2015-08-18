var chai = require("chai")
var expect = chai.expect
var request = require("supertest-as-promised")

var path = require("path")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))
var _ = require("underscore")

var expressAppsDir = path.join(__dirname, "./express-apps")
var appPaths = fs.readdirSync(expressAppsDir)

describe("express-apps", function(){

  _.each(appPaths, function(appFile){

    describe(appFile, function(){

      it("should return json with name", function(done){
        var appPath = path.resolve(path.join(expressAppsDir, appFile))
        var app = require(appPath)
        return request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res).to.have.deep.property("body.name", "tobi")
        })
        .expect(200, done)
      })

    })

  })

})
