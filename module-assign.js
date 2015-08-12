var debug = require('debug')('module-assign')
var _ = require('lodash')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))

/** add local module assign to node_modules*/
function moduleAssign (moduleFile, moduleName) {
  return moduleAssign.getPackage()
  .then(function (pkg) {
    var optionsSet = moduleAssign.getOptions(moduleFile, moduleName)
    return moduleAssign.link(optionsSet)
    .then(function () {
      return moduleAssign.buildLinkedDeps(optionsSet, pkg)
    })
  })
}

/** add array of modules to node_modules */
moduleAssign.all = function (moduleFiles) {
  return moduleAssign.getPackage()
  .then(function (pkg) {
    var optionsSet = moduleAssign.getOptions(moduleFiles)
    return moduleAssign.link(optionsSet)
    .then(function () {
      return moduleAssign.buildLinkedDeps(optionsSet, pkg)
    })
  })
}

/** install localDependencies modules from package.json */
moduleAssign.install = function (moduleFiles) {
  return moduleAssign.getPackage()
  .then(function (pkg) {
    var optionsSet = moduleAssign.getOptions(pkg.localDependencies)
    return moduleAssign.link(optionsSet)
    .then(function () {
      return moduleAssign.buildLinkedDeps(optionsSet, pkg)
    })
  })
}

/** debug message from promise then */
moduleAssign.debugMsg = function () {
  var args = Array.prototype.slice.call(arguments)
  return function (value) {
    debug.apply(null, args)
    return value
  }
}

/** catch message for debug from promise catch */
moduleAssign.debugCatch = function (e) {
  debug(e.message)
  return false
}

/** get the package for the cwd */
moduleAssign.getPackage = function () {
  var thisPkg = 'package.json'
  return fs.readFileAsync(thisPkg, 'utf8').then(JSON.parse)
  .then(moduleAssign.debugMsg('file read %s', thisPkg))
  .then(function (pkg) {
    pkg.localDependencies = pkg.localDependencies || {}
    return pkg
  })
}

/** convert complex argument types to standard optionsSet */
moduleAssign.getOptions = function (moduleFile, moduleName) {
  if (!moduleFile) return []
  if (Array.isArray(moduleFile)) {
    // it's an array
    var moduleFiles = moduleFile
    return _.map(moduleFiles, function (moduleFile) {
      return moduleAssign.options(moduleFile)
    })
  } else if (typeof moduleFile === 'object') {
    // if object assume it's pkg deps object
    var moduleFilesObj = _.pairs(moduleFile)
    if (!moduleFilesObj.length) return []
    return _.map(moduleFilesObj, function (args) {
      return moduleAssign.options(args[1], args[0])
    })
  } else {
    // assume strings
    return [moduleAssign.options(moduleFile, moduleName)]
  }
}

/** sets the options for a file */
moduleAssign.options = function (moduleFile, moduleName) {
  var options = {}
  options.file = (moduleFile) ? path.parse(moduleFile) : false
  options.file.format = (moduleFile) ? path.format(options.file) : false
  options.name = moduleName || options.file.name || false
  options.nodeModulesDst = path.join('node_modules')
  options.linkModuleDst = path.join('node_modules', options.name)
  options.packgeDst = path.join('node_modules', options.name, './package.json')
  options.package = {}
  options.package.name = options.name
  options.package.main = (moduleFile) ? path.join('../../', moduleFile) : false
  options.package.assignedModule = true
  return options
}

/** like an array of options (optionsSet) */
moduleAssign.link = function (optionsSet) {
  return Promise.map(optionsSet, function (options) {
    var modulePackage = JSON.stringify(options.package, null, 2)
    var dirs = path.dirname(options.packgeDst)
    return fs.mkdirsAsync(dirs)
    .then(moduleAssign.debugMsg('dirs made %s', dirs))
    .catch(moduleAssign.debugCatch)
    .then(function () {
      return fs.writeFileAsync(options.packgeDst, modulePackage)
      .then(moduleAssign.debugMsg('file written %s', options.packgeDst))
      .catch(moduleAssign.debugCatch)
    })
  })
}

moduleAssign.extendInvert = function (incoming, existing) {
  var withoutDupes = _.chain(existing)
  .pairs()
  .filter(function (val) {
    return !_.contains(_.values(incoming), val[1])
  })
  .object()
  .value()
  _.extend(withoutDupes, incoming)
  return withoutDupes
}

moduleAssign.getRemoveDeps = function (newDeps, existingLinkedDeps) {
  var removeDeps = _.difference(_.keys(existingLinkedDeps), _.keys(newDeps))
  return Promise.map(removeDeps, function (removeDep) {
    var mod = path.join('node_modules', removeDep)
    return fs.removeAsync(mod)
    .then(moduleAssign.debugMsg('removed %s', mod))
    .catch(moduleAssign.debugCatch)
  })
}

moduleAssign.buildLinkedDeps = function (optionsSet, pkg) {
  var linkedDeps = _.chain(optionsSet)
  .map(function (options) {
    return [options.name, options.file.format]
  })
  .object()
  .value()
  var newpkg = _.clone(pkg)
  newpkg.localDependencies = moduleAssign.extendInvert(linkedDeps, pkg.localDependencies)
  return Promise.props({
    rmUnused: moduleAssign.getRemoveDeps(newpkg.localDependencies, pkg.localDependencies),
    updatePkg: fs.writeJsonAsync('./package.json', newpkg)
    .then(moduleAssign.debugMsg('file written %s', './package.json'))
    .catch(moduleAssign.debugCatch)
  })
}

module.exports = moduleAssign
