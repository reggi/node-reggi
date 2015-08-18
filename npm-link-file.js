var Promise = require("bluebird")
var fs = Promise.promisifyAll(require('fs-extra'))
var argv = require('minimist')(process.argv.slice(2));
var init = require('init-package-json')
var path = require('path')

var packageJson = {
  "name": argv._[0],
  "main": argv._[1]
}

var linkeDir = "./node_modules_linked"
var moduleDir = path.join(linkeDir, packageJson.name)
var packagePath = path.join(moduleDir, "./package.json")
var indexPath = path.join(moduleDir, "index.js")
var moduleDestination = path.join("./node_modules/", packageJson.name)

Promise.each([
  fs.ensureDirAsync(linkeDir),
  fs.ensureDirAsync(moduleDir),
  fs.ensureFileAsync(packagePath),
  fs.symlinkAsync(main, indexPath),
  fs.symlinkAsync(moduleDir, moduleDestination)
])


// create a directory of node_modules_linked
// created new directory node_modules_linked/<name>
// create package.json with name and main
// simlink file to node_modules_linked/<name>/index.js
// run `linkfile file module-name`
