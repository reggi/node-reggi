var Promise = require("bluebird")
Promise.prototype.always = function(fn){return this.then(fn, fn)}
var empty = function(done){ done() }
var chai = require("chai")
var expres = chai.expect
var request = require("supertest-as-promised")
var createExpressApp = require("../create-express-app")

describe('helpers-app-helpers.js', function(){
  describe('testing app.get with anonymous-router', function(){
    it('respond with json', function(done){
      var app = createExpressApp.withAppRouter("get", '/anonymous-router', function(req, res){
        return res.json({ name: 'tobi' })
      })
      request(app)
        .get('/anonymous-router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
  describe('testing app.get with express-router', function(){
    it('respond with json', function(done){
      var app = createExpressApp.withRouter("get", '/express-router', function(req, res){
        return res.json({ name: 'tobi' })
      })
      request(app)
        .get('/express-router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
  describe('testing app.get with promise-router', function(){
    it('respond with json', function(done){
      var app = createExpressApp.withPromiseRouter("get", '/promise-router', function(req, res){
        return res.json({ name: 'tobi' })
      })
      request(app)
        .get('/promise-router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
  describe('testing app.get with all routers', function(){
    it('respond with json', function(done){
      var apps = createExpressApp.array("get", '/router', function(req, res){
        return res.json({ name: 'tobi' })
      })
      Promise.map(apps, function(app){
        return request(app)
          .get('/router')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
      }).catch(done).then(empty(done))
    })
  })
})
