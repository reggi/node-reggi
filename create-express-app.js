var S = require("underscore.string")
var express = require("express")
var promiseRouter = require('express-promise-router')
var argx = require('argx')
var _ = require("underscore")

function createExpressApp(/*Router, method, url, middleware*/) {
  var app = express()
  var args = argx(arguments)
  var Router = args.shift('function') || app
  var method = args.shift('string') || "use"
  var url = args.shift('string') || null
  var middleware = _.flatten([args.remain()])
  if(url) app[method](url, middleware)
  if(!url) app[method](middleware)
  return app
}

createExpressApp.appRouter = function(){
  return express()
}
createExpressApp.router = function(){
  return express.Router()
}
createExpressApp.promiseRouter = function(){
  return promiseRouter()
}
createExpressApp.routers = ["appRouter", "router", "promiseRouter"]

var createExpressAppWithRoutes = _.chain(createExpressApp.routers).map(function(prop){
  var name = "with" + S.capitalize(prop)
  return [name, function(){
    var args = _.values(arguments)
    args.unshift(createExpressApp[prop]())
    return createExpressApp.apply(null, args)
  }]
}).object().value()

_.extend(createExpressApp, createExpressAppWithRoutes)

createExpressApp.array = function(/*Router, method, url, middleware*/){
  var args = argx(arguments)
  var routers = _.values(_.pick.apply(null, _.flatten([createExpressApp, createExpressApp.routers])))
  var method = args.shift('string') || "use"
  var url = args.shift('string') || null
  var middleware = _.flatten([args.remain()])
  return _.map(routers, function(router){
    var args = [router, method, url, middleware]
    return createExpressApp.apply(null, args)
  })
}

module.exports = createExpressApp
