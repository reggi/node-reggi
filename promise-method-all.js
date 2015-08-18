var Promise = require("bluebird")
var _ = require("underscore")

// take object of functions and turn them into promises

module.exports = function(obj, deep){
  return _.mapObject(obj, function(fn){
    if(!deep) return Promise.method(fn)
    return function(){
      var args = arguments
      var argValues = _.values(arguments)
      var nestedFn = fn.apply(null, argValues)
      if(typeof nestedFn == "function") return Promise.method(nestedFn)
      return Promise.method(fn)
    }
  })
}
