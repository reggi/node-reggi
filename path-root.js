var path = require("path")
var _ = require("underscore")

/**
 * Returns a new path where the root of the `srcPath` is
 * prepended to the `destPath` and the file from the `srcPath`
 * is appened.
 * @function pathPredictDir
 * @param {String} srcPath
 * @param {String} destPath
 * @return {String}
 * @example
 * predictDir("hello.txt", "foo/bar")
 * // -> "foo/bar/hello.txt"
 * @example
 * predictDir("Users/thomas/Desktop/hello.txt", "foo/bar")
 * // -> "Users/thomas/Desktop/foo/bar/hello.txt"
 */

/**
 * The common root
 */

function pathRoot(srcpath, dstdir){
  var a = {}
  a.srcpath = srcpath
  a.srcbase = path.basename(srcpath)
  a.srcdir = path.dirname(srcpath)
  a.dstdir = dstdir
  a.srcdirSplit = a.srcdir.split(path.sep)
  a.dstdirSplit = a.dstdir.split(path.sep)
  a.wherePathsIntersect = _.intersection(a.srcdirSplit, a.dstdirSplit)
  a.wherePathsDiffer = _.difference(a.srcdirSplit, a.dstdirSplit)
  a.rootDirBase = _.flatten([a.wherePathsDiffer, a.dstdirSplit, a.srcbase])
  if(path.isAbsolute(dstdir)) a.rootDirBase.unshift("/")
  if(path.isAbsolute(srcpath)) a.rootDirBase.unshift("/")
  return path.join.apply(null, a.rootDirBase)
}

module.exports = pathRoot
