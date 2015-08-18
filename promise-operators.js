var dotty = require("dotty")

var exportResult = function(obj, property){
  return function(value){
    dotty.put(obj, property, value)
    return value
  }
}

var importResult = function(obj, property){
  return function(){
    return dotty.get(obj, property)
  }
}
