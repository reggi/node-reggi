var dotty = require("dotty")
var lo = require("lodash")
var _ = require("underscore")
var path = require("path")
var argx = require("argx")
var Promise = require("bluebird")
var fsExtra = Promise.promisifyAll(require("fs-extra"))

var fsRedux = {}

/**
 * Get the type of a path
 * @method type
 * @param {String} srcpath - File system path
 * @return {String} type
 */
fsRedux.type = function(srcpath){
  return fsExtra.lstatAsync(srcpath).then(function(stats){
    if(stats.isFile()) return "file"
    if(stats.isDirectory()) return "directory"
    if(stats.isBlockDevice()) return "blockedDevice"
    if(stats.isCharacterDevice()) return "characterDevice"
    if(stats.isSymbolicLink()) return "symbolicLink"
    if(stats.isFIFO()) return "FIFO"
    if(stats.isSocket()) return "socket"
    return "unknownType"
  })
}

/**
 * Get whether or not path exists
 * @method exists
 * @param {String} srcpath - File system path
 * @return {Boolean} exists
 */
fsRedux.exists = function(srcPath){
  return fsExtra.lstatAsync(srcPath)
  .then(function(){
    return true
  })
  .catch(function(){
    return false
  })
}

/**
 * Throws error if type of path isn't `desiredType`
 * @method ifType
 * @param {String} srcpath - File system path
 * @param {String} [desiredResult=true] - String type of path matching against
 * @return {String} Type of path
 * @throws type is not desired type
 */
fsRedux.ifType = function(srcpath, desiredResult){
  return fsRedux.type(srcpath).then(function(type){
    if(desiredResult == type) return type
    throw new Error("type is not desired result")
  })
}

/**
 * Throws error if path doesnt match `desiredResult`.
 * @method ifExists
 * @param {String} srcpath - File system path
 * @param {Boolean} [desiredResult=true] - Desired result
 * @return {Boolean} True if file exists, false if file does not.
 */
fsRedux.ifExists = function(srcPath, desiredResult){
  if(typeof desiredResult == "undefined") desiredResult = true
  return fsRedux.exists(srcPath).then(function(exists){
    if(desiredResult == exists) return exists
    throw new Error("exists is not desired result")
  })
}

fsRedux.predictPath = function(srcPath, destPath){
  var intersection = _.intersection(srcPath.split(path.sep), destPath.split(path.sep))
  intersection = path.join.apply(null, intersection)
  var difference = _.difference(srcPath.split(path.sep), intersection.split(path.sep))
  difference = path.join.apply(null, difference)
  return path.join(destPath, difference)
}

fsRedux.predictDir = function(srcPath, destPath){
  var isDir = false
  if(destPath.substr(-1) == "/") isDir = true
  if(path.extname(destPath) == "") isDir = true
  if(isDir) return fsRedux.predictPath(srcPath, destPath)
  return destPath
}

fsRedux.ensureLink = function(srcPath, dstPath){
  dstPath = fsRedux.predictDir(srcPath, dstPath)
  var dstDir = path.dirname(dstPath)
  return fsRedux.exists(dstPath).then(function(exist){
    if(!exist){
      return fsExtra.mkdirsAsync(dstDir).then(function(){
        return fsExtra.linkAsync(srcPath, dstPath)
      })
    }
    return false
  })
}

fsRedux.ensureLink = function(srcPath, dstPath){
  dstPath = fsRedux.predictDir(srcPath, dstPath)
  var dstDir = path.dirname(dstPath)
  return fsRedux.exists(dstPath).then(function(exists){
      return fsRedux.ifFalseThrow(exists, false, new Error(dstPath+" exists cannot ensure link"))
    }).then(function(){
      return fsExtra.mkdirsAsync(dstDir)
    }).then(function(){
      return fsExtra.linkAsync(srcPath, dstPath)
    })
}

fsRedux.ifFalseThrow = function(value, desiredValue, error){
  if(value !== desiredValue) throw error
  return value
}

fsRedux.expEnsureLink = function(srcPath, dstPath){
  dstPath = fsRedux.predictDir(srcPath, dstPath)
  var dstDir = path.dirname(dstPath)
  var values = {}
  return fsRedux.exists(dstPath).tap(console.log)
    .then(lo.partialRight(fsRedux.ifFalseThrow, false, new Error(dstPath+" exists cannot ensure link"))).tap(console.log)
    .then(lo.bind(fsExtra.mkdirsAsync, fsExtra, dstDir))
    .then(lo.bind(fsExtra.linkAsync, fsExtra, srcPath, dstPath))
}

module.exports = fsRedux

//
// lib.ensureLinkInDirAsync = function(theFile, dir){
//   var projectedDir = function(){
//     var theFileDir = path.dirname(theFile)
//     var intersection = _.intersection(theFileDir.split(path.sep), dir.split(path.sep))
//     var commonRoot = path.join.apply(null, intersection)
//     var difference = _.difference(theFileDir.split(path.sep), commonRoot.split(path.sep))
//     var newPaths = path.join.apply(null, difference)
//     return path.join(dir, newPaths)
//   }()
//   projectedFile = path.join(projectedDir, path.basename(theFile))
//   return f.lstatTypeAsync(projectedFile).then(function(type){
//     if(type !== "file") throw new Error("file already exists")
//     return fsExtra.mkdirsAsync(projectedDir).then(function(success){
//       return fsExtra.linkAsync(theFile, projectedFile)
//     })
//   })
// }


  // return fsRedux.type(destPath).then(function(type){
  //   return type == "directory"
  // })
  // .catch(function(type){
  //   return false
  // }).then(function(dstpathIsDir){
  //
  // })

  // return fsRedux.type(destPath).then(function(type){
  //   if(type == "directory"){
  //
  //   }else if(type == "file"){
  //
  //   }
  // })


/**
 * Cretes link or "hard link".
 * @method ensureLink
 * @param {String} srcpath - File system path
 * @param {Boolean} desiredResult - Desired result
 * @return {Boolean} True if file exists, false if file does not.
 * @example
 * fsRedux.ensureLink("./package.json", "./test")
 * // newLink => , "./test/package.json" (creates package.json within test)
 * @example
 * fsRedux.ensureLink("./test/lib.js", "./my-module")
 * newLink => , "./my-module/test/lib.js" (creates test dir and lib.js)
 */
