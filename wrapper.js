var argx = require("argx")

var xAnon = function(){

}

function x(){

}

var test = function(/*fn*/){
  var args = argx(arguments)
  var fn = args.shift("function")
  return fn
}


console.log(test(xAnon))
console.log(test(x))

// var Promise = require("bluebird")
// var _ = require("underscore")
// var S = require("underscore.string")
// var argx = require("argx")
//
// function fnAsObjMethod(/*fn, fnName, objFns*/){
//   var args = argx(arguments)
//   var fn = args.shift("function")
//   var fnName = args.shift("string")
//   var objFns = args.shift('object')
//   if(!fn && objFns && objFns[fnName]) fn = objFns[fnName]
//   if(!fnName && fn.name !== "") fnName = fn.name
//   if(!fnName) throw new Error("no name found or provided")
//   return [fnName, fn]
// }
//
// var x = standardizeFunctionName(libx.ifHappy)
// console.log(x)
// var x = standardizeFunctionName(ifHappy)
// console.log(x)
// var x = standardizeFunctionName("ifHappy", lib)
// console.log(x)
// var x = standardizeFunctionName(ifHappyAnon, "ifHappy")
// console.log(x)

//
// lib.logStatus = function(status){
//   console.log(status)
// }
//
// lib.convertBoldHtml = function(str){
//   return "<b>"+str+"</b>"
// }
//
// lib.convertItalic = function(str){
//   return "<i>"+str+"</i>"
// }
//
// function getFunctioName(string, fn, objFn){
//   if(string) return string
//   if(typeof fn == "function") return fn.name
//   if(typeof objFn == "function") return objFn.name
//   throw new Error ("no name found")
// }
//
// function fnDetail(fn, string){
//   var temp = {}
//   var objFn = (typeof fn == "object") ? fn[string] : false
//
//
//
//   temp[string] = (typeof fn == "object") ? fn[string] : fn
//   return temp
// }
//
// var happy = function(){
//   console.log("happy")
// }
//
// fnDetail(happy, "happy")
//
// function happy(){
//   console.log("happy")
// }
//
// fnDetail(happy)
//
// var lib = {}
//
// lib.happy = function(){
//   console.log("happy")
// }
//
// fnDetail(lib, "happy")
//
// lib.happy = function happy(){
//   console.log("happy")
// }
//
// fnDetail(lib.happy)
// fnDetail(lib, "happy")
//
//
//
// var prefix = [
//   {
//     obj: lib,
//     fnName: "ifHappy"
//   }
// ]
//
//
// var prefix = [
//   {
//     fn: ifHappy
//   }
// ]
//
//
//
// functionName: // if blank and anon throw error
//
//
// // var prefix = [
// //   {
// //     obj: lib,
// //     fn: "ifHappy",
// //     arguments: 1,
// //   }
// // ]
// //
// // var suffix = [
// //   {
// //     fn: lib.logStatus,
// //     arguments: 1,
// //     argument_offset: 1,
// //   },
// //   {
// //     obj: lib,
// //     fn: "convertBoldHtml",
// //     arguments: 1,
// //     argument_offset: 0,
// //   },
// //   {
// //     obj: lib,
// //     fn: "convertItalic",
// //     arguments: 1,
// //     argument_offset: 0,
// //   }
// // ]
// //
// // if(typeof item.fn == "string"){
// //   if(!item.obj) throw new Error("need object for "+item.fn)
// //   item.fn = item.obj[item.fn]
// // }
// // return item
// //
// // var prefix = _.chain(prefix)
// //   .map(function(item){
// //     console.log(item)
// //   })
// //   .value()
// //
// // console.log(prefix)
// //
// // _.each(prefix, function(prefix){
// //   _.each(suffix, function(suffixName){
// //     var suffixFn = lib[suffixName]
// //     var newName = prefixName + S.capitalize(suffixName)
// //     lib[newName] = function(){
// //       var args = _.values(arguments)
// //       return Promise.method(prefixFn).apply(null, args)
// //         .then(function(value){
// //           Promise.method(suffixFn).apply(null, args)
// //         })
// //     }
// //   })
// // })
// //
// // lib.ifHappyLogStatus("happy")
// //
// // console.log(lib)
