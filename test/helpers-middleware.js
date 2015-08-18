var Promise = require("bluebird")
var express = require("express")
var httpMocks = require('node-mocks-http')
var req  = httpMocks.createRequest({"url": "/"})
var res = httpMocks.createResponse()
var router = express.Router()
var promiseRouter = require('express-promise-router')()

req.test = true

function middlewareRun(router, req, res, middleware){
  if(!req.url || req.url == "") req.url = "/"
  return new Promise(function(resolve, reject){
    router.use(middleware)
    return router(req, res, function(err){
      console.log(err)
      if(err) return reject(err)
      return resolve()
    })
  })
}

middlewareRun(router, req, res, function(req, res, next){
  req.test = false
  return next()
}).then(function(){
  console.log(req.test)
})

middlewareRun(promiseRouter, req, res, function(req, res, next){
  req.test = false
  return Promise.resolve("next")
}).then(function(){
  console.log(req.test)
})



var Promise = require("bluebird")
Promise.prototype.always = function(fn){return this.then(fn, fn)}
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var expect = chai.expect
var httpMocks = require('node-mocks-http')
var middlewareRun = require("../middleware-run")
var _ = require("underscore")

function middlewareSetTest(value){
  return function(req, res, next){
    req.test = value
    return next()
  }
}

function middlewareNextRoute(req, res, next){
  return next("route")
}

function middlewareSendfunction(value){
  return function(req, res, next){
    return res.send("hi")
  }
}

function middlewareThrowError(req, res, next){
  throw new Error("test error thrown")
}

function middlewareNextError(req, res, next){
  return next(new Error("test error next"))
}



describe("middlewareRun()", function(){
  describe("preventing the chain conditionally", function(){
    it("should have test prop foo & return route", function(done){
      var req  = httpMocks.createRequest({})
      var res = httpMocks.createResponse()

        helpers.middlewarePutReq("test", true)(req, res, next)


    })
  })
})
