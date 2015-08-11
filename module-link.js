var debug = require('debug')('module-link')
var _ = require('lodash')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))

function moduleLink (moduleFile, moduleName) {
  return moduleLink.link(moduleFile, moduleName)
}

moduleLink.all = function (moduleFiles) {
  return Promise.map(moduleFiles, function (moduleFile) {
    return moduleLink.link(moduleFile)
  })
}

moduleLink.install = function (thisPkg) {
  thisPkg = thisPkg || path.join('./package.json')
  return fs.readFileAsync(thisPkg, 'utf8').then(JSON.parse)
  .then(function (pkg) {
    return Promise.map(_.pairs(pkg.linkedDependencies), function (dep) {
      return moduleLink.link(dep[1], dep[0])
    })
  })
}

moduleLink.options = function (moduleFile, moduleName) {
  var options = {}
  options.file = (moduleFile) ? path.parse(moduleFile) : false
  options.file.format = (moduleFile) ? path.format(options.file) : false
  options.name = moduleName || options.file.name || false
  options.nodeModulesDst = path.join('node_modules')
  options.linkModuleDst = path.join('node_modules', options.name)
  options.packgeDst = path.join('node_modules', options.name, './package.json')
  options.thisPkg = path.join('package.json')
  options.package = {}
  options.package.name = options.name
  options.package.main = (moduleFile) ? path.join('../../', moduleFile) : false
  return options
}

/** debug message from promise then */
moduleLink.debugMsg = function () {
  var args = Array.prototype.slice.call(arguments)
  return function (value) {
    debug.apply(null, args)
    return value
  }
}

/** catch message for debug from promise catch */
moduleLink.debugCatch = function (e) {
  debug(e.message)
  return false
}

moduleLink.link = function (moduleFile, moduleName) {
  var options = moduleLink.options(moduleFile, moduleName)
  var modulePackage = JSON.stringify(options.package, null, 2)
  var dirs = path.dirname(options.packgeDst)
  return fs.mkdirsAsync(dirs)
  .then(moduleLink.debugMsg('dirs made %s', dirs))
  .catch(moduleLink.debugCatch)
  .then(function () {
    return fs.writeFileAsync(options.packgeDst, modulePackage)
    .then(moduleLink.debugMsg('file written %s', options.packgeDst))
    .catch(moduleLink.debugCatch)
    .then(function () {
      return moduleLink.updateRetroactive(options)
    })
  })
}

moduleLink.inflateDeps = function (linkedDeps, options) {
  return _.chain(linkedDeps)
  .map(function (value, key) {
    return {
      'name': key,
      'main': value,
      'location': path.join('node_modules', key),
      'ditto': value === options.file.format && key !== options.name
    }
  })
  .value()
}

moduleLink.deflateDeps = function (inflatedLinkedDeps) {
  return _.chain(inflatedLinkedDeps)
  .map(function (arr) {
    return [arr.name, arr.main]
  })
  .zipObject()
  .value()
}

moduleLink.updateRetroactive = function (options) {
  return fs.readFileAsync(options.thisPkg, 'utf8').then(JSON.parse)
  .then(moduleLink.debugMsg('file read %s', options.thisPkg))
  .then(function (pkg) {
    if (!pkg.linkedDependencies) pkg.linkedDependencies = {}
    var inflatedDeps = moduleLink.inflateDeps(pkg.linkedDependencies, options)
    var removeDeps = _.where(inflatedDeps, { 'ditto': true })
    var existingDeps = _.where(inflatedDeps, { 'ditto': false })
    return Promise.map(removeDeps, function (removeDep) {
      return fs.removeAsync(removeDep.location)
      .then(moduleLink.debugMsg('removed dep %s', removeDep.location))
      .catch(moduleLink.debugCatch)
    })
    .then(function () {
      pkg.linkedDependencies = moduleLink.deflateDeps(existingDeps)
      pkg.linkedDependencies[options.name] = options.file.format
      return fs.writeFileAsync(options.thisPkg, JSON.stringify(pkg, null, 2))
      .then(moduleLink.debugMsg('file written %s', options.thisPkg))
      .catch(moduleLink.debugCatch)
    })
  })
}

module.exports = moduleLink
