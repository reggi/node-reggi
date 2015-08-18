// var Promise = require("bluebird")
// Promise.prototype.always = function(fn){return this.then(fn, fn)}
// var empty = function(done){ done() }
// var chai = require("chai")
// var expect = chai.expect
// var expres = chai.expect
// var request = require("supertest-as-promised")
// var promiseRouter = require("express-promise-router")
// var createExpressApp = require("../create-express-app")
// var middlewareRun = require("../middleware-run")
//
// describe("middleware-run.js", function(){
//   it('respond with json', function(done){
//     var app = createExpressApp.withPromiseRouter("get", '/router', function(req, res){
//       return middlewareRun.withPromiseRouter(req, res, function(){
//         return res.json({ name: 'tobi' })
//       })
//     })
//     return request(app)
//       .get('/router')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(function(res) {
//         expect(res).to.have.deep.property("body.name", "tobi")
//       })
//       .expect(200, done)
//   })
//
//   it('respond with json', function(done){
//     var app = createExpressApp.withPromiseRouter("get", '/hello-world', function(req, res){
//       return middlewareRun.withPromiseRouter(req, res, function(){
//         return res.json({ name: 'tobi' })
//       })
//     })
//     return request(app)
//       .get('/hello-world')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(function(res) {
//         expect(res).to.have.deep.property("body.name", "tobi")
//       })
//       .expect(200, done)
//   })
//
//   it('respond with json', function(done){
//     var app = createExpressApp(promiseRouter, "get", '/hello-world', function(req, res){
//       return middlewareRun(promiseRouter, req, res, function(){
//         return res.json({ name: 'tobi' })
//       })
//     })
//     return request(app)
//       .get('/hello-world')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(function(res) {
//         expect(res).to.have.deep.property("body.name", "tobi")
//       })
//       .expect(200, done)
//   })
//
//   // it('respond with json', function(done){
//   //   // creates an app with a `.use` route at "/"
//   //   var app = createExpressApp(promiseRouter, function(req, res){
//   //     // runs a route with `.use` route at "/"
//   //     return middlewareRun(promiseRouter, req, res, function(req, res){
//   //       return res.json({ name: 'tobi' })
//   //     })
//   //   })
//   //   request(app)
//   //     .get('/express-router')
//   //     .set('Accept', 'application/json')
//   //     .expect('Content-Type', /json/)
//   //     .expect(200, done)
//   // })
// })
