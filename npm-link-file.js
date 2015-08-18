var debug = require("debug")
debug.enable('*')
debug = debug("linkfile")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require('fs-extra'))
var argv = require('minimist')(process.argv.slice(2));
var path = require('path')

// rundown:
// create directory `node_modules_linked`
// create direcotry `node_modules_linked/<name>`
// create `package.json` with name and main
// simlink `<file>` to `node_modules_linked/<name>/index.js`
// simlink `node_modules_linked/<name>` to `node_modules/<name>`
// run `linkfile file module-name`

var packageJson = {
  "name": argv._[1],
  "main": "./index.js"
}

var fileToLink = path.resolve(path.join(argv._[0]))
var linkDir = path.resolve("node_modules_linked")
var moduleDir = path.resolve(path.join(linkDir, packageJson.name))
var packagePath = path.resolve(path.join(moduleDir, "./package.json"))
var indexPath = path.resolve(path.join(moduleDir, "index.js"))
var moduleDestination = path.resolve(path.join("./node_modules/", packageJson.name))

// console.log(linkDir)
// console.log(moduleDir)
// console.log(packagePath)
// console.log(indexPath)
// console.log(moduleDestination)

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

var empty = function(){}

Promise.each([
  fs.ensureDirAsync(linkDir),
  fs.ensureDirAsync(moduleDir),
  fs.writeFileAsync(packagePath, JSON.stringify(packageJson, null, 2)),
  ensureSymlink(moduleDir, moduleDestination, "dir"),
  ensureSymlink(fileToLink, indexPath, "file")
], empty).then(function(){
  debug("%s linked", packageJson.name)
})
