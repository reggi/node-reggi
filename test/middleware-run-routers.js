var Promise = require("bluebird")
Promise.prototype.always = function(fn){return this.then(fn, fn)}
var empty = function(done){ done() }
var chai = require("chai")
var expres = chai.expect
var request = require("supertest-as-promised")
var helpers = require('./helpers')

describe('middleware-run-routers.js', function(){
  describe('testing app.get with all routers', function(){
    it('respond with json', function(done){
      var apps = helpers.appAllRouters("get", '/router', function(req, res){
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
