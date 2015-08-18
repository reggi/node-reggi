var Promise = require("bluebird")
Promise.prototype.always = function(fn){return this.then(fn, fn)}
var empty = function(done){ done() }
var chai = require("chai")
var expres = chai.expect
var request = require("supertest-as-promised")
var helpers = require('./helpers')
var runMiddleware = require("../router-run-middleware")
var promiseRouter = require('express-promise-router')()

describe('middleware-run-routers.js', function(){
  describe('testing app.get with all routers', function(){
    it('respond with json', function(done){
      var app = helpers.appViaPromiseRouter("get", '/router', function(req, res){
        return runMiddleware(promiseRouter, req, res, function(){
          return res.json({ name: 'tobi' })
        }).then(function(){
          console.log("hello") // never fires because returned
        }).catch(function(e){
          console.log(e)
        })
      })
      return request(app)
        .get('/router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
})
