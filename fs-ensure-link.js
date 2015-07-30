var R = require("ramda")
var path = require("path")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))
var fse = Promise.promisifyAll(require("fs-extra"))
var fsExists = require("./fs-exists")

/**
 * Ensures a Link or "hard link" to a file.
 * @param  {String} srcpath - Source of the link
 * @param  {String} dstpath - Destination of the new link
 * @return {Promise.<True, Error>}
 */
function fsEnsureLink(srcpath, dstpath){
  return Promise.all([
    fsExists(srcpath).then(function(exists){
      if(!exists) throw new Error("source path does not exist")
      return false
    }),
    fsExists(dstpath).then(function(exists){
      if(exists) throw new Error("destination path already exists")
      return false
    })
  ]).then(function(){
    return fse.mkdirs(path.dirname(dstpath))
  }).then(function(){
    return fs.linkAsync(srcpath, dstpath)
  }).then(R.T)
}

module.exports = fsEnsureLink
