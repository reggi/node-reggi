var path = require('path')
var fs = require("fs")
var fse = require('fs-extra')
var mkdir = fse

function createSymlink(srcpath, dstpath, callback) {
  function makeSymlink(){
    return fs.lstat(srcpath, function(err, stats){
      if (err) return callback(err)
      var type = false
      if(stats.isFile()) var type = "file"
      if(stats.isDirectory()) var type = "dir"
      if(!type) return callback(new Error("source is not file or directory"))
      return fs.symlink(srcpath, dstpath, type, function (err) {
        if (err) return callback(err)
        return callback()
      })
    })
  }

  return fs.exists(dstpath, function (fileExists) {
    if (fileExists) return callback()
    var dir = path.dirname(dstpath)
    fs.exists(dir, function (dirExists) {
      if (dirExists) return makeSymlink()
      mkdir.mkdirs(dir, function (err) {
        if (err) return callback(err)
        makeSymlink()
      })
    })
  })
}

function createSymlinkSync (srcpath, dstpath) {
  if (fs.existsSync(dstpath)) return

  var dir = path.dirname(dstpath)
  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  var stats = fs.lstatSync(srcpath)
  var type = false
  if(stats.isFile()) var type = "file"
  if(stats.isDirectory()) var type = "directory"
  if(!type) throw new Error("source is not file or directory")

  fs.symlinkSync(srcpath, dstpath, type)
}

module.exports = {
  createSymlink: createSymlink,
  createSymlinkSync: createSymlinkSync,
  // alias
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
}
