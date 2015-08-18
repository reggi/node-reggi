var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs-extra"))

/**
 * `npm install lstat-type --save`
 * @module {CommonJS} lstat-type
*/


/** Get the type from a path.
 * @param {String} [thePath] The file path.
 * @returns {Promise.<String, Boolean>} Promise returns a string of path type or `false` if doesn't exist.
 * @example
 * lstatType("./package.json")
 *   .then(function(type){
 *     console.log(type) // => "file"
 *   })
*/
function lstatType(thePath){
  return fs.lstatAsync(thePath).then(function(stats){
    return lstatType.lookup(stats)
  }).catch(function(e){
    return false
  })
}

/** Get the type from stats.
 * @param {Object} [stats] The object stats from lstats.
 * @returns {String} A string of path type.
 * @example
 * var stats = fs.lstatSync("./package.json")
 * lstatType.lookup(stats) // => "file"
*/
lstatType.lookup = function(stats){
  if(stats.isFile()) return "file"
  if(stats.isDirectory()) return "directory"
  if(stats.isBlockDevice()) return "blockedDevice"
  if(stats.isCharacterDevice()) return "characterDevice"
  if(stats.isSymbolicLink()) return "symbolicLink"
  if(stats.isFIFO()) return "FIFO"
  if(stats.isSocket()) return "socket"
  return "unknownType"
}

module.exports = lstatType
