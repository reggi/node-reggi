var S = require("underscore.string")
var httpMocks = require('node-mocks-http')
var Promise = require("bluebird")
var _ = require("underscore")
var argx = require("argx")

var runner = {}

runner.routerApp = function(){
  return express()
}
runner.routerExpress = function(){
  return express.Router()
}
runner.routerPromise = function(){
  return promiseRouter()
}
runner.routers = ["routerApp", "routerExpress", "routerPromise"]

runner.middlewareRun = function(/*router, req, res, middleware*/){
  var args = argx(arguments)
  var Router = args.shift('function') || runner.routerApp()
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

var middlewareRunWithRouters = _.chain(runner.routers).map(function(prop){
  var name = "middlewareRunWith" + S.capitalize(prop)
  return [name, function(){
    var args = _.values(arguments)
    args.unshift(runner[prop]())
    return runner.middlewareRun.apply(null, args)
  }]
}).object().value()

_.extend(runner, middlewareRunWithRouters)

module.export = runner
