var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))
var R = require("ramda")

/**
 * Checks if a path exists on the file System
 * @param  {String} thePath - Path of file
 * @return {Boolean} True if exists, false if doesn't exist
 */
function fsExists(thePath){
  return fs.lstatAsync(thePath).then(R.T, R.F)
}

module.exports = fsExists
