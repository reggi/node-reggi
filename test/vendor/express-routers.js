var chai = require("chai")
var expres = chai.expect
var request = require('supertest')
var express = require('express')
var expressRouter = express.Router()
var promiseRouter = require('express-promise-router')();
var app = express()

app.get('/anonymous-router', function(req, res){
  return res.json({ name: 'tobi' })
})

expressRouter.use(function(req, res){
  return res.json({ name: 'tobi' })
})

app.get('/express-router', expressRouter)

promiseRouter.use(function(req, res){
  return res.json({ name: 'tobi' })
})

app.get('/promise-router', promiseRouter)

describe('express-routers.js', function(){
  describe('testing app.get with anonymous-router', function(){
    it('respond with json', function(done){
      request(app)
        .get('/anonymous-router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
  describe('testing app.get with express-router', function(){
    it('respond with json', function(done){
      request(app)
        .get('/express-router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
  describe('testing app.get with promise-router', function(){
    it('respond with json', function(done){
      request(app)
        .get('/promise-router')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })
  })
})
