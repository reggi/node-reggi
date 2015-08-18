var Promise = require("bluebird")
var _ = require("underscore")

module.exports = function(){
  var args = _.values(arguments)
  var req = args[0]
  var res = args[1]
  var middlewareChain = _.flatten([_.rest(args, 2)])

  function next(val){
    if(!val) return "next"
    return val
  }

  function NextRoute(message) {
    this.name = "nextRoute"
    this.message = (message || "")
  }
  NextRoute.prototype = Object.create(Error.prototype);

  var values = []
  return Promise.each(middlewareChain, function(middleware){
    return Promise.method(middleware)(req, res, next)
    .then(function(value){
      if(value == undefined) throw new NextRoute()
      if(value == "route") throw new NextRoute() // exit the promise chain
      if(value == "next") return "next"
      throw value
    }).then(function(value){
      values.push(value)
    })
  })
  .then(function(){
    return _.last(values)
  })
  .catch(NextRoute, function(e){
    return "route"
  })
}
