var _ = require("underscore")

// Types as arguments
// * Funciton -> fn
// * Array -> arr
// * Object -> obj
// * String -> str
// * Date -> dte
// * Number -> num

module.exports = [
  function getFunctionName(fn){
    //http://stackoverflow.com/a/17923727/340688
    //http://stackoverflow.com/a/31508354/340688
    if(fn.name) return fn.name
    return /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1]
  },
  function objecfifyFunctions(arr){
    return _.chain(arr)
      .map(function(fn){
        return [_.functionName(fn), fn]
      })
      .object()
      .value()
  },
  function test(){
    return "hello world"
  },
  function consumer(){
    return _.test()
  }
]

mixin2 = [
  function daft(){
    return "punk"
  }
]

var mixin = module.exports


//
//

//
// var model = objecfify([
//   function create(){
//     return "create"
//   },
//   function read(){
//     return "read"
//   },
//   function update(){
//     throw new Error("updating was unsuccessful")
//   },
//   function remove(){
//     return "delete"
//   }
// ])





// var _ = require("underscore")
//
// _.mixin({
//   test: function(){
//     return "hello world"
//   },
//   consumer: function(){
//     return _.test()
//   }
// })
//
// console.log(_.consumer())










// var _ = require("underscore")
//
// _.mixin({
//   test: function(){
//     return "hello world"
//   },
//   consumer: function(){
//     return _.test()
//   }
// })
//
// console.log(_.consumer())

// var _ = require("underscore")
// var myObject = {}
//
// _.extend(myObject, {
//   consumer: function(){
//     return myObject.test()
//   },
//   test: function(){
//     return "hello world"
//   },
// })

// console.log(myObject.consumer())

//
// function functionName(fn){
//   //http://stackoverflow.com/a/17923727/340688
//   return /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1]
// }
//
// function objecfify(arr){
//   return _.chain(arr)
//     .map(function(fn){
//       return [functionName(fn), fn]
//     })
//     .object()
//     .value()
// }
//
// var model = objecfify([
//   function create(){
//     return "create"
//   },
//   function read(){
//     return "read"
//   },
//   function update(){
//     throw new Error("updating was unsuccessful")
//   },
//   function remove(){
//     return "delete"
//   }
// ])

///model.update()
//
// This will log:
//
// ```
// /Users/thomas/Desktop/risk/mixin.js:25
//     throw new Error("updating was unsuccessful")
//           ^
// Error: updating was unsuccessful
//     at Object.update (/Users/thomas/Desktop/risk/mixin.js:25:11)
//     at Object.<anonymous> (/Users/thomas/Desktop/risk/mixin.js:32:7)
// ```
//
// On the other hand an objects where the properties are assigned to anonymous functions.
//
// var model = {
//   create: function (){
//     return "create"
//   },
//   read: function(){
//     return "read"
//   },
//   update: function(){
//     throw new Error("updating was unsuccessful")
//   },
//   remove: function(){
//     return "delete"
//   }
// }
//
// model.update()
//



// modules.exports = {
//   //http://stackoverflow.com/a/17923727/340688
//   functionName = function(fn){
//     return /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1]
//   }
// }
//
//
//
//
// ```javascript
// function log(string, val){
//   console.log("/////"+string+"/////")
//   console.log(val)
// }
// ```
//
// Log functions of objects
//
//
//
// ```
// function logFnObj(obj){
//   return _.each(_.keys(obj), function(prop){
//     console.log("middlewareRun."+prop)
//   })
// }
//
//
