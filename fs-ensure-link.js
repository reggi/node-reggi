var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))

function CreateLink(message) {
  this.name = "createLink"
  this.message = (message || "")
}
CreateLink.prototype = Object.create(Error.prototype);

function ensureLink(srcpath, dstpath, type){
  return fs.lstatAsync(dstpath).catch(function(e){
    // file doesn't exist create it
    throw new CreateLink()
  }).then(function(stats){
    // if is symbolic link unlink
    if(stats.isSymbolicLink()) return fs.unlinkAsync(dstpath).throw(new CreateLink())
    // if other file throw
    throw new Error("file index.js exists and isn't a symbolic link")
  }).catch(CreateLink, function(){
    // create file
    return fs.linkAsync(srcpath, dstpath, type)
  })
}

module.exports = ensureLink
