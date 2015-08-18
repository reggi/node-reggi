var _ = require("underscore")
_.mixin(require("./underscore-gatherable"))

var middleware = _.makeGatherable()

middleware.next = function(){
  return function(req, res, next){
    return next()
  }
}

middleware.json = function(){
  return function(req, res, next){
    return res.json({"name": "tobi"})
  }
}

var use = [
  middleware.next(),
  middleware.json()
]

_.extendGatherable(middleware)

console.log(use) // [ [function], [function] ]

//or

var use = middleware
  .gather()
  .next()
  .json()
  .value()

console.log(use)  // [ [function], [function] ]
