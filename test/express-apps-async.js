// var chai = require("chai")
// var expect = chai.expect
// var request = require("supertest-as-promised")
//
// var path = require("path")
// var Promise = require("bluebird")
// var fs = Promise.promisifyAll(require("fs"))
// var _ = require("underscore")
//
// var apps = function(){
//   return fs.readdirAsync("./express-apps")
//   .then(_)
//   .call("filter", function(item){
//     return path.extname(item) == ".js"
//   })
//   .call("map", function(item){
//     return path.resolve(path.join("./express-apps", item))
//   })
// }
//
// describe("express-apps", function(){
//
//   apps().map(function(appPath){
//
//     it("should return json with name", function(done){
//
//       var app = require(appPath)
//       return request(app)
//       .get('/')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(function(res) {
//         expect(res).to.have.deep.property("body.name", "tobi")
//       })
//       .expect(200, done)
//
//     })
//
//   })
//
// })
