var _ = require("underscore")
var argx = require("argx")

/**
 * `npm install fn-as-obj-method --save`
 * @summary Way of standardizing and naming a function.
 * @module {CommonJS} fn-as-obj-method
 * @param {Function} [fn] - The function you want to assign / get a name of.
 * @param {String} [fnName] - The function name override.
 * @param {Object} [objFns] - The object that contains function property `fnName`.
 * @return {Object} {fnName: [function]}
 * @throws {Error} no name found or provided
 * @example
 * _.mixin(fnAsObjMethod(require("join-camel-case")))
 * @example
 * var anon = {}
 * anon.ifHappy = function(str){
 *   if(str == "happy") return true
 *   return false
 * }
 * fnAsObjMethod("ifHappy", anon) // => {"ifHappy": [function]}
 * @example
 * var anon = {}
 * anon.ifHappy = function(str){
 *   if(str == "happy") return true
 *   return false
 * }
 * fnAsObjMethod(anon.ifHappy) // throws
 * @example
 * // returns {"ifHappy": [function]}
 * var known = {}
 * known.ifHappy = function ifHappy(str){
 *   if(str == "happy") return true
 *   return false
 * }
 * fnAsObjMethod(known.ifHappy) // => {"ifHappy": [function]}
 * @example
 * function ifHappy(str){
 *   if(str == "happy") return true
 *   return false
 * }
 * fnAsObjMethod(ifHappy) // => {"ifHappy": [function]}
 * @example
 * var ifHappy = function(str){
 *   if(str == "happy") return true
 *   return false
 * }
 * fnAsObjMethod("ifHappy", ifHappy) // => {"ifHappy": [function]}
 */
function fnAsObjMethod(/*fn, fnName, objFns*/){
  var args = argx(arguments)
  var fn = args.shift(Function)
  var fnName = args.shift(String)
  var objFns = args.shift(Object)
  if(!fn && objFns && objFns[fnName]) fn = objFns[fnName]
  if(!fnName && fn._name) fnName = fn._name
  if(!fnName && fn.name) fnName = fn.name
  if(!fnName) throw new Error("no name found or provided")
  return _.object([[fnName, fn]])
}

module.exports = fnAsObjMethod
