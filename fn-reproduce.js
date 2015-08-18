var _ = require("underscore")
var Promise = require("bluebird")
var S = require("underscore.string")
var argx = require("argx")
var fnAsObjMethod = require("./fn-as-obj-method")
_.mixin(fnAsObjMethod(require("./join-camel-case")))

/**
 * @file `npm install fn-reproduce --save`
 * @summary Take two functions and stitch them together to make a third, that interacts with parent arguments.
 * @module fn-reproduce
 * @example
 * _.extend(lib, fnReproduce.buildFnPrependArgs(lib, "readFile", "appendString", 2))
 * lib.readFileAppendString("hello.txt", "utf8", "world").should.eventually.equal("hello world")
 */

var fnReproduce = {}

/**
 * Singular verison of `.match()`
 * @method _match
 * @param {Object} fns - The object with two functions.
 * @param {Number} [childArgOffset=0] - The number offset of parent arguments passed to child.
 * @param {} [matchValue] - Value to match result of parent promise.
 * @param {} [nonMatchValue] - Value to return if match is not made.
 * @return {Object} {fnName: [function]}
 */
fnReproduce._match = function(/*fns, childArgOffset, matchValue, nonMatchValue*/){
  var args = argx(arguments)
  var a = {}
  a.fns = args.shift("object")
  a.childArgOffset = args.shift("number") || 0
  a.matchValue = args.shift() || true
  a.nonMatchValue = args.shift() || false
  a.name = _.chain(a.fns).keys().joinCamelCase().value()
  a.fnsOnly = _.values(a.fns)
  var parentFn = a.fnsOnly[0]
  var childFn = a.fnsOnly[1]
  var newFn = function(){
    var parentArgs = _.values(arguments)
    var childArgs = _.rest(parentArgs, a.childArgOffset)
    var calledParentFn = parentFn.apply(null, parentArgs)
    if(calledParentFn && typeof calledParentFn.then === 'function'){
      return calledParentFn.then(function(value){
        if(value == a.matchValue) return childFn.apply(null, childArgs)
        return a.nonMatchValue
      })
    }else{
      var value = calledParentFn
      if(value == a.matchValue) return childFn.apply(null, childArgs)
      return a.nonMatchValue
    }
  }
  return _.object([[a.name, newFn]])
}

/**
 * Singular verison of `.prependArgs()`
 * @method _prependArgs
 * @param {Object} fns - The object with two functions.
 * @param {Number} [childArgOffset=0] - The number offset of parent arguments passed to child.
 * @return {Object} {fnName: [function]}
 */
fnReproduce._prependArgs = function(/*fns, childArgOffset*/){
  var args = argx(arguments)
  var a = {}
  a.fns = args.shift("object")
  a.childArgOffset = args.shift("number") || 0
  a.name = _.chain(a.fns).keys().joinCamelCase().value()
  a.fnsOnly = _.values(a.fns)
  var parentFn = a.fnsOnly[0]
  var childFn = a.fnsOnly[1]
  var newFn = function(){
    var parentArgs = _.values(arguments)
    var childArgs = _.rest(parentArgs, a.childArgOffset)
    var calledParentFn = parentFn.apply(null, parentArgs)
    if(calledParentFn && typeof calledParentFn.then === 'function'){
      return calledParentFn.then(function(value){
        childArgs.unshift(value)
        return childFn.apply(null, childArgs)
      })
    }else{
      var value = calledParentFn
      childArgs.unshift(value)
      return childFn.apply(null, childArgs)
    }
  }
  return _.object([[a.name, newFn]])
}

/**
 * Singular version of `buildFn`
 * @method _buildFn
 * @param {Object} obj - The object of functions.
 * @param {String} parentName - Parent function name.
 * @param {String} childName - Child function name.
 * @return {Object} fns {parent: [function], child: [function]}
 */
fnReproduce._buildFn = function(obj, parentName, childName){
  var fns = {}
  _.extend(fns, fnAsObjMethod(parentName, obj))
  _.extend(fns, fnAsObjMethod(childName, obj))
  return fns
}

/**
 * Builds an object of functions based on the object and array or string properties provided.
 * @method buildFn
 * @param {Object} obj - The object of functions.
 * @param {String|Array} parentName(s) - The array or string of parent function name(s).
 * @param {String|Array} childrenName(s) - The array or string of children function name(s).
 * @return {Object} fnsArr [{parent: [function], child: [function]}]
 */
fnReproduce.buildFn = function fnReproduceBuildFn(obj, parentNames, childrenNames){
  parentNames = _.flatten([parentNames])
  childrenNames = _.flatten([childrenNames])
  var value = _.map(parentNames, function(parentName){
    return _.map(childrenNames, function(childName){
      return fnReproduce._buildFn(obj, parentName, childName)
    })
  })
  return _.flatten(value)
}

/**
 * Takes an object of two functions and merge them together creating a third.
 * The result of the parent function is prepended to the arguments for the child.
 * @method prependArgs
 * @summary Takes two functions creates third that unshift the parent result into child args.
 * @param {Object|Array} fns|fnsArr - Either array of fns, or fns.
 * @param {Number} [childArgOffset=0] - The number offset of parent arguments passed to child.
 * @return {Object} {fnName: [function]} - Object with one or multiple function methods.
 */
fnReproduce.prependArgs = function fnReproducePrependArgs(/*fnsArr*/){
  var args = argx(arguments)
  var fnsArr = args.shift(Array) || args.shift("object")
  fnsArr = _.flatten([fnsArr])
  var remain = args.remain()
  var results = _.map(fnsArr, function(fns){
    var childArgs = _.clone(remain)
    childArgs.unshift(fns)
    return fnReproduce._prependArgs.apply(null, childArgs)
  })
  return _.extend.apply(null, [{}].concat(results))
}

/**
 * Takes an object of two functions and merge them together creating a third.
 * If the result of the parent function is equal to the `matchValue` argument
 * the child function fires, else the `nonMatchValue` is returned.
 * @method match
 * @summary Takes two functions creates third that fires based on value of parent.
 * @param {Object} fns - The object with two functions.
 * @param {Number} [childArgOffset=0] - The number offset of parent arguments passed to child.
 * @param {String|Boolean|Number} [matchValue] - Value to match result of parent promise.
 * @param {String|Boolean|Number} [nonMatchValue] - Value to return if match is not made.
 * @return {Object} {fnName: [function]} - Object with one or multiple function methods.
 */
fnReproduce.match = function fnReproduceMatch(/*fnsArr, childArgOffset, matchValue, nonMatchValue*/){
  var args = argx(arguments)
  var fnsArr = args.shift(Array) || args.shift("object")
  fnsArr = _.flatten([fnsArr])
  var remain = args.remain()
  var results = _.map(fnsArr, function(fns){
    var childArgs = _.clone(remain)
    childArgs.unshift(fns)
    return fnReproduce._match.apply(null, childArgs)
  })
  return _.extend.apply(null, [{}].concat(results))
}

/**
 * Shorthand for running buildFn() & match().
 * @method buildFnMatch
 * @param {Object} obj - The object of functions.
 * @param {String|Array} parentName(s) - The array or string of parent function name(s).
 * @param {String|Array} childrenName(s) - The array or string of children function name(s).
 * @param {Number} [childArgOffset=0] - The number offset of parent arguments passed to child.
 * @param {String|Boolean|Number} [matchValue] - Value to match result of parent promise.
 * @param {String|Boolean|Number} [nonMatchValue] - Value to return if match is not made.
 * @return {Object} {fnName: [function]} - Object with one or multiple function methods.
 */
var fns = fnReproduce.buildFn(fnReproduce, "buildFn", "match")
_.extend(fnReproduce, fnReproduce.prependArgs(fns, 3))

/**
 * Shorthand for running buildFn() & prependArgs().
 * @method buildFnPrependArgs
 * @param {Object} obj - The object of functions.
 * @param {String|Array} parentName(s) - The array or string of parent function name(s).
 * @param {String|Array} childrenName(s) - The array or string of children function name(s).
 * @param {Number} [childArgOffset=0] - The number offset of parent arguments passed to child.
 * @return {Object} {fnName: [function]} - Object with one or multiple function methods.
 */
var fns = fnReproduce.buildFn(fnReproduce, "buildFn", "prependArgs")
_.extend(fnReproduce, fnReproduce.prependArgs(fns, 3))

module.exports = fnReproduce
