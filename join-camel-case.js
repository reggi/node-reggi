var S = require("underscore.string")
var _ = require("underscore")

/**
 * `npm install join-camel-case --save`
 * @summary Join string array values in camel case.
 * @module {CommonJS} join-camel-case
 * @param {Array} [arr] - The array of strings
 * @return {String}
 * @example
 * joinCamelCase(["hello", "world"]) // => "helloWorld"
 */
module.exports = function joinCamelCase(arr){
  return _.reduce(arr, function(total, item){
    if(total == "") return item
    return total + S.capitalize(item)
  }, "")
}
