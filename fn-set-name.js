var _ = require("underscore")
var argx = require("argx")

/**
 * `npm install fn-with-name-prop --save`
 * @summary Adds `_name` property to function
 * @module {CommonJS} fn-with-name-prop
 * @param {Function} [fn] - The function you want to assign / get a name of.
 * @param {String} [fnName] - The function name override.
 * @param {Object} [objFns] - Object method or methods.
 * @return {Function} { [function] _name: fnName} - Function with name prop.
 * @throws {Error} no name found or provided
 * @throws {Error} no function found or provided
 * @example
 * // with single object method
 * var fn = fnSetName({hello: function(){}})
 * expect(fn).to.be.instanceof(Function)
 * expect(fn).to.have.property("_name", "hello")
 * @example
 * // with anon function
 * var fn = fnSetName(function(){}, "hello")
 * expect(fn).to.be.instanceof(Function)
 * expect(fn).to.have.property("_name", "hello")
 * @example
 * // with named function
 * var fn = fnSetName(function hello(){})
 * expect(fn).to.be.instanceof(Function)
 * expect(fn).to.have.property("_name", "hello")
 * @example
 * // with assigned named function
 * var lib = function hello(){}
 * var fn = fnSetName(lib)
 * expect(fn).to.be.instanceof(Function)
 * expect(fn).to.have.property("_name", "hello")
 * @example
 * // with object method
 * var lib = {}
 * lib.hello = function(){}
 * var fn = fnSetName("hello", lib)
 * expect(fn).to.be.instanceof(Function)
 * expect(fn).to.have.property("_name", "hello")
 * @example
 * // with named object method
 * var lib = {}
 * lib.hello = function hello(){}
 * var fn = fnSetName("hello", lib)
 * expect(fn).to.be.instanceof(Function)
 * expect(fn).to.have.property("_name", "hello")
 */
function fnSetName(/*fn, fnName, objFns*/){
  var args = argx(arguments)
  var fn = args.shift(Function)
  var fnName = args.shift(String)
  var objFns = args.shift(Object)
  var theFn = function(){
    if(fn) return fn
    if(!fn && objFns && _.size(objFns) == 1) return _.values(objFns)[0]
    if(!fn && objFns && objFns[fnName]) return objFns[fnName]
    throw new Error("no function found or provided")
  }()
  var theName = function(){
    if(fnName) return fnName
    if(!fn && objFns && _.size(objFns) == 1) return _.keys(objFns)[0]
    if(!fnName && theFn.name) return fn.name
    if(!fnName && theFn._name) return fn._name
    throw new Error("no name found or provided")
  }()
  theFn._name = theName
  return theFn
}

module.exports = fnSetName
