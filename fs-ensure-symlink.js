var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))

function CreateSymlink(message) {
  this.name = "createSymlink"
  this.message = (message || "")
}
CreateSymlink.prototype = Object.create(Error.prototype);

function ensureSymlink(srcpath, dstpath, type){
  return fs.lstatAsync(dstpath).catch(function(e){
    // file doesn't exist create it
    throw new CreateSymlink()
  }).then(function(stats){
    // if is symbolic link unlink
    if(stats.isSymbolicLink()) return fs.unlinkAsync(dstpath).throw(new CreateSymlink())
    // if other file throw
    throw new Error("file index.js exists and isn't a symbolic link")
  }).catch(CreateSymlink, function(){
    // create file
    return fs.symlinkAsync(srcpath, dstpath, type)
  })
}

module.exports = ensureSymlink
