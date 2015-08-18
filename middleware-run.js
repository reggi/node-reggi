var S = require("underscore.string")
var express = require("express")
var promiseRouter = require('express-promise-router')
var argx = require('argx')
var _ = require("underscore")
var Promise = require("bluebird")

function middlewareRun(/*router, req, res, middleware*/){
  var args = argx(arguments)
  var router = args.shift('function') || express()
  var req = args.shift('object') || httpMocks.createRequest()
  var res = args.shift('object') || httpMocks.createResponse()
  var middleware = _.flatten([args.remain()])
  if(!req.url || req.url == "") req.url = "/"
  return new Promise(function(resolve, reject){
    router.use(middleware)
    return router(req, res, function(err){
      if(err) return reject(err)
      return resolve(req, res)
    })
  })
}

middlewareRun.appRouter = function(){
  return express()
}
middlewareRun.router = function(){
  return express.Router()
}
middlewareRun.promiseRouter = function(){
  return promiseRouter()
}
middlewareRun.routers = ["appRouter", "router", "promiseRouter"]

var middlewareRunWithRoutes = _.chain(middlewareRun.routers).map(function(prop){
  var name = "with" + S.capitalize(prop)
  return [name, function(){
    var args = _.values(arguments)
    args.unshift(middlewareRun[prop]())
    return middlewareRun.apply(null, args)
  }]
}).object().value()

_.extend(middlewareRun, middlewareRunWithRoutes)

module.exports = middlewareRun
