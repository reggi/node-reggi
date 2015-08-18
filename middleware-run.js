var Promise = require("promise")

function middlewareRun(/*router, req, res, middleware*/){
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

module.exports = middlewareRun
