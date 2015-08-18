var _ = require("underscore")
var path = require("path")
var express = require("express")

function middlewareGenerator(Router){
  this.Router = Router
}

middleware.run = function(Router, middleware){
  return function(req, res, next){
    return middleware.proxy(req, res, next, Router, middleware)
  }
}

middleware.proxy = function(/*req, res, fn, Router, middleware*/){
  var args = argx(arguments)
  var req = args.pop('object')
  var res = args.pop('object')
  var next = args.pop('function')
  var Router = args.pop('function')
  var middleware = _.flatten([args.remain()])
  var router = Router()
  router.use(middleware)
  return router(req, res, fn)
}

middleware.json = function(req, res, next){
  return res.json({"name": "tobi"})
}

function expressAppCreator(str){

  var pieces = str.split(path.sep)
  pieces = _.difference(pieces, [""])

  var appMethod = pieces[0].split(".")[1]
  // var routes = pieces.split(".")[1]

  console.log(pieces)

  var app = express()

  // app[appMethod]

  return app

}


// expressAppCreator("/app.get/route/middleware-json")
// expressAppCreator("/app.get/route/middleware-makeroute/array/json")

expressAppCreator("/app.get/route/array/middleware-json")
expressAppCreator("/app.get/route/array/middleware-makeroute/array/json")
expressAppCreator("/app.get/route/array/middleware-makeroute/json")
