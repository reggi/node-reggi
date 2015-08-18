#!/usr/bin/env node

var suppress = function(){}
var dotty = require("dotty")
var path = require("path")
var _ = require("underscore")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require('fs-extra'))
var argv = require('minimist')(process.argv.slice(2))

var crawlDeps = require("crawl-deps")


if(!argv._[0]) throw new Error("need main file to build module")

var component = {}
var paths = {}

component.main = argv._[0]
component.name = path.basename(component.main, path.extname(component.main))

paths.mainFile = path.resolve(component.main)
paths.nodeModulesDir = path.resolve(path.join(paths.mainFile, "..", "node_modules"))
paths.newModuleDirDest = path.resolve(path.join(paths.mainFile, "..", "node_modules", component.name))
paths.testFile = path.resolve(path.join(paths.mainFile, "..", "test", component.main))
paths.readmeFile = path.resolve(path.join(paths.mainFile, "..", "docs", component.name+".md"))
paths.rootPackageFile = path.resolve(path.join(paths.mainFile, "..", "package.json"))
paths.buildModulesDir = path.resolve(path.join(paths.mainFile, "..", "node_modules_build"))
paths.newModuleDir = path.resolve(path.join(paths.mainFile, "..", "node_modules_build", component.name))
paths.newModuleTestDir = path.resolve(path.join(paths.mainFile, "..", "node_modules_build", component.name, "test"))
paths.newModuleTestFile = path.resolve(path.join(paths.mainFile, "..", "node_modules_build", component.name, "test", component.main))
paths.newModuleReadmeFile = path.resolve(path.join(paths.mainFile, "..", "node_modules_build", component.name, "readme.md"))
paths.newModuleMainFile = path.resolve(path.join(paths.mainFile, "..", "node_modules_build", component.name, component.main))
paths.newModulePackageFile = path.resolve(path.join(paths.mainFile, "..", "node_modules_build", component.name, "package.json"))

var fs = require('./fs-plus')

function setPackageDeps(op){
  op.newPackage.dependencies = _.chain(op.deps.npm)
    .map(function(dep){
      return [dep, op.package.dependencies[dep]]
    })
    .object()
    .value()
  var missing = _.difference(op.deps.npm, _.keys(op.newPackage.dependencies))
  if(missing.length > 1) throw new Error("missing dependencies: "+ missing.join(", ")+".")
  if(missing.length == 1) throw new Error("missing dependency: "+ missing.join(", ")+".")
  return op
}

function setPackageDevDeps(op){
  if(!op.devDeps) return op
  op.newPackage.devDependencies = _.chain(op.devDeps.npm)
    .filter(function(dep){
      return !_.contains(_.keys(op.newPackage.dependencies), dep)
    })
    .map(function(dep){
      return [dep, op.package.devDependencies[dep]]
    })
    .object()
    .value()
  var allDeps = _.flatten([_.keys(op.newPackage.devDependencies), _.keys(op.newPackage.dependencies)])
  var missing = _.difference(op.devDeps.npm, allDeps)
  if(missing.length > 1) throw new Error("missing devDependencies: "+ missing.join(", ")+".")
  if(missing.length == 1) throw new Error("missing devDependency: "+ missing.join(", ")+".")
  return op
}

function newPackageDeps(){
  return Promise.props({
    "newPackage": {
      "name": component.name,
      "main": component.main
    },
    "package": fs.readFileAsync(paths.rootPackageFile, "utf8")
      .then(JSON.parse),
    "deps": crawlDeps(paths.mainFile)
      .then(crawlDeps.sort)
      .then(crawlDeps.getValues),
    "devDeps": fs.lstatAsync(paths.testFile).then(function(){
      return crawlDeps(paths.testFile)
        .then(crawlDeps.sort)
        .then(crawlDeps.getValues)
    }).catch(suppress)
  })
  .then(setPackageDeps)
  .then(setPackageDevDeps)
  .then(function(op){
    if(!op.deps) dotty.put(op, "deps.local", [])
    if(!op.devDeps) dotty.put(op, "devDeps.local", [])
    return fs.writeOrExtendJsonAsync(paths.newModulePackageFile, op.newPackage)
    .then(function(){
      var localdeps = _.flatten([op.deps.local, op.devDeps.local])
      return Promise.map(localdeps, function(dep){
        var ext = path.extname(paths.mainFile)
        var file = path.resolve(path.join(paths.mainFile, "..", dep+ext))
        return fs.ensureLinkInDirAsync(file, paths.newModuleDir).catch(suppress)
      })
    })
  })
}

paths.localTest = path.join("./test/", fileName)
paths.moduleTest = path.join("./", newModulesFolder, newModule, "test")
paths.linkedTest = path.join(path.join("./", newModulesFolder, newModule, "test", fileName)


var mkdirs = Promise.promisify(require("fs-extra").mkdirs)

var ensureLink = function(srcpath, dstpath){
  return Promise.props({
    // check if the srcpath exists
    "srcExists": fs.lstatAsync(srcpath)
      .catch(function(){ throw new Error("Source path does not exist") }),
    // check if the destination path exists
    "dstExists": fs.lstatAsync(dstpath)
      .then(function(){ throw new Error("Destination path already exists") }),
      .catch(function(){ return true })
  }).then(function(){
    return mkdirs(path.dirname(dstpath))
  }).then(function(){
    return fs.linkAsync(srcpath, dstpath)
  })
}


function buildModule(){
  return Promise.all([
    fs.ensureDirAsync(paths.buildModulesDir),
    fs.ensureDirAsync(paths.nodeModulesDir),
    fs.ensureDirAsync(paths.newModuleDir),
    newPackageDeps(),
    fs.ifFileExistsEnsureLinkInDirAsync(paths.mainFile, paths.newModuleDir).catch(suppress),
    fs.ifFileExistsEnsureLinkInDirAsync(paths.testFile, paths.newModuleDir).catch(suppress),
    fs.ifFileExistsEnsureLinkInDirAsync(paths.readmeFile, paths.newModuleDir).catch(suppress),
    fs.ensureLinkInDirAsync(paths.newModuleDir, paths.newModuleDirDest).catch(suppress)
  ])
}

buildModule()
