var dotty = require('dotty')
var debug = require('debug')('module-builder')
var _ = require('lodash')
var R = require('ramda')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var packageDeps = require('./package-deps')

function moduleBuilder (mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName, packageFile) {

  var paths = {}
  paths.main = path.join(mainFile)
  paths.name = (moduleName) ? path.join(moduleName) : path.join(path.basename(mainFile, path.extname(mainFile)))
  paths.testDir = (testDir) ? testDir : path.join('test')
  paths.docsDir = (docsDir) ? docsDir : path.join('docs')
  paths.localModulesDir = (localDir) ? localDir : path.join('local_modules')
  paths.packagesDir = (packagesDir) ? packagesDir : path.join('packages')
  paths.binDir = (binDir) ? binDir : path.join('bin')
  paths.package = (packageFile) ? path.join(packageFile) : path.join('package.json')
  paths.readmeName = (readmeName) ? readmeName : path.join('readme.md')
  paths.nodeModulesDir = path.join('node_modules')
  paths.nodeModulesDirDst = path.join(paths.nodeModulesDir, paths.name)
  paths.localModulesDirDst = path.join(paths.localModulesDir, paths.name)
  paths.readme = path.join(paths.docsDir, paths.name + '.md')
  paths.bin = path.join(paths.binDir, paths.main)
  paths.packageBackup = path.join(paths.packagesDir, 'package-' + paths.name + '.json')
  paths.packageDst = path.join(paths.localModulesDirDst, 'package.json')

  // var symlinks = []
  return packageDeps(paths.main, paths.package)
  .then(function (results) {
    return Promise.props({
      'readmeExists': fs.lstatAsync(paths.readme).then(R.T, R.F),
      'binExists': fs.lstatAsync(paths.bin).then(R.T, R.F)
    }).then(function (props) {
      return _.extend(results, props)
    })
  })
  .then(function (results) {
    var links = []
    links.push(results.testFiles)
    links.push(results.deps.local)
    links.push(results.binDeps.local)
    links.push(results.devDeps.local)
    links.push(results.deps.root)
    if (results.readmeExists) links.push(paths.readme)
    if (results.binExists) links.push(paths.bin)
    results.links = _.chain([links]).flattenDeep().unique().value()
    return results
  })
  .then(function (results) {
    var modulePackage = {}
    modulePackage.name = paths.name
    modulePackage.main = paths.main
    if (results.binExists) modulePackage.bin = paths.bin
    if (results.testFiles.length && dotty.exists(results, 'package.scripts.test')) dotty.put(modulePackage, 'scripts.test', results.package.scripts.test)
    if (results.package.author) modulePackage.author = results.package.author
    modulePackage.dependencies = results.pkgDeps.dependencies
    modulePackage.devDependencies = results.pkgDeps.devDependencies
    results.modulePackage = modulePackage
    return results
  })
  .then(function (results) {
    // make links
    var operations = {}
    return moduleBuilder.makeLinks(results.links, paths.localModulesDirDst)
    .then(function (links) {
      operations.links = links
      return operations
    })
    .then(function (operations) {
      // make package
      return moduleBuilder.writePackage(paths.packageDst, paths.packageBackup, results.modulePackage)
    })
    .then(function (pkg) {
      operations.package = pkg
      return operations
    })
    .then(function (operations) {
      // make symlinkModule
      return fs.ensureSymlinkAsync(paths.localModulesDirDst, paths.nodeModulesDirDst)
        .then(moduleBuilder.debugMsg('symlinked module %s -> %s', paths.localModulesDirDst, paths.nodeModulesDirDst))
        .catch(moduleBuilder.debugCatch)
    })
    .then(function (symlinkModule) {
      operations.symlinkModule = symlinkModule
      return operations
    })
  })
}

moduleBuilder.writePackage = function (packageDst, packageBackup, modulePackage) {
  return Promise.props({
    'backup': fs.readJsonAsync(packageBackup).catch(R.F),
    'destination': fs.readJsonAsync(packageDst).catch(R.F)
  }).then(function (pkg) {
    if (!pkg.destination) {
      return fs.writeJsonAsync(packageDst, modulePackage)
      .then(moduleBuilder.debugMsg('package written'))
      .catch(moduleBuilder.debugCatch)
    } else if (pkg.destination) {
      var updatedPackage = _.cloneDeep(pkg.destination)
      _.extend(updatedPackage, modulePackage)
      return fs.writeJsonAsync(packageDst, updatedPackage)
      .then(moduleBuilder.debugMsg('package destination updated'))
      .catch(moduleBuilder.debugCatch)
    } else if (pkg.backup) {
      var updatedPackageFromBackup = _.cloneDeep(pkg.backup)
      _.extend(updatedPackageFromBackup, modulePackage)
      return fs.writeJsonAsync(packageDst, updatedPackageFromBackup)
      .then(moduleBuilder.debugMsg('package restored and updated from backup'))
      .catch(moduleBuilder.debugCatch)
    } else {
      return fs.writeJsonAsync(packageDst, modulePackage)
      .then(moduleBuilder.debugMsg('package restored and updated from backup'))
      .catch(moduleBuilder.debugCatch)
    }
  })
  .then(function () {
    return fs.ensureLinkAsync(packageDst, packageBackup)
    .then(moduleBuilder.debugMsg('package backedup'))
    .catch(moduleBuilder.debugCatch)
  })
}

moduleBuilder.makeLinks = function (links, localModuleDirDst) {
  links = _.flattenDeep([links])
  return Promise.map(links, function (link) {
    var dstpath = path.join(localModuleDirDst, link)
    return fs.ensureLinkAsync(link, dstpath)
    .then(moduleBuilder.debugMsg('link ensured %s -> %s', link, dstpath))
    .catch(moduleBuilder.debugCatch)
  })
}

moduleBuilder.debugMsg = function () {
  var args = Array.prototype.slice.call(arguments)
  return function (value) {
    debug.apply(null, args)
    return value
  }
}

moduleBuilder.debugCatch = function (e) {
  debug(e.message)
  return false
}

module.exports = moduleBuilder
