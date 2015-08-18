var _ = require("underscore")
var Promise = require("bluebird")

module.exports = function(obj, deep){
  return _.mapObject(obj, function(fn){
    if(!deep) return Promise.method(fn)
    return function(){
      var nestedFn = fn.apply(null, _.values(arguments))
      return Promise.method(nestedFn)
    }
  })
}
