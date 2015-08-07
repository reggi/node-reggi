var path = require('path')
var _ = require('lodash')
var Promise = require('bluebird')
var acorn = require('acorn')
var umd = require('acorn-umd')
var fs = Promise.promisifyAll(require('fs'))
var arrExtract = require('./arr-extract')

var NATIVES
var LREGEX
var FREGEX
var ACORNOPTS
var UMDOPTS

function recursiveDeps (srcpath, localRegex, filterRegex, acornParseOptions, umdOptions, natives) {
  NATIVES = (natives || Object.keys(process.binding('natives')))
  LREGEX = (localRegex || /^.\.\/|^.\/|^\//)
  FREGEX = (filterRegex || /\.json$/)
  ACORNOPTS = (acornParseOptions || {sourceType: 'module', ecmaVersion: 6, allowHashBang: true})
  UMDOPTS = (umdOptions || {es6: true, amd: true, cjs: true})
  return recursiveDeps.getChildren(srcpath)
}

recursiveDeps.depsFormat = function (childDeps, parentDep, rootDep) {
  return _.chain([childDeps])
  .flattenDeep()
  .map(recursiveDeps.depClense)
  .without(false)
  .map(function (dep) {
    dep.original = path.format(dep)
    dep.isRoot = (rootDep === true)
    dep.parent = (parentDep) ? path.join(parentDep.parent, parentDep.dir) : '.'
    dep.type = (dep.isRoot) ? 'root' : recursiveDeps.depType(dep.original)
    dep.base = (dep.type === 'local' && dep.ext === '' && rootDep && rootDep.ext) ? dep.name + rootDep.ext : dep.base
    dep.ext = (dep.type === 'local' && dep.ext === '' && rootDep && rootDep.ext) ? rootDep.ext : dep.ext
    dep.relative = _.clone(dep)
    dep.relative.dir = (dep.type === 'local' || dep.type === 'root') ? path.join(dep.parent, dep.dir) : dep.dir
    dep.relative = (dep.relative.dir) ? path.join(path.format(dep.relative)) : dep.original
    dep.traverse = (dep.type === 'local' || dep.type === 'root')
    dep.children = []
    return dep
  })
  .value()
}

recursiveDeps.depType = function (dep, natives, localRegex, filterRegex) {
  natives = (NATIVES || natives || Object.keys(process.binding('natives')))
  localRegex = (LREGEX || localRegex || /^.\.\/|^.\/|^\//)
  filterRegex = (FREGEX || filterRegex || /\.json$/)
  if (dep.match(filterRegex)) return 'invalid'
  if (dep.match(localRegex)) return 'local'
  if (_.contains(natives, dep)) return 'native'
  return 'npm'
}

recursiveDeps.depClense = function (dep) {
  if (typeof dep === 'string') return path.parse(dep)
  if (dep && dep.source && dep.source.value) return path.parse(dep.source.value)
  if (dep && dep.source && !dep.source.value) return false
  if (typeof dep === 'object' && (dep.base || dep.dir)) return path.parse(path.format(dep))
  return false
}

recursiveDeps.getChildren = function (rootDeps, acornParseOptions, umdOptions) {
  acornParseOptions = (ACORNOPTS || acornParseOptions || {sourceType: 'module', ecmaVersion: 6, allowHashBang: true})
  umdOptions = (UMDOPTS || umdOptions || {es6: true, amd: true, cjs: true})
  function _getChildren (parentDeps, rootDep) {
    return Promise.map(parentDeps, function (parentDep) {
      if (!parentDep.traverse) return true
      if (!parentDep.children) return true
      return fs.readFileAsync(parentDep.relative, 'utf8').then(function (content) {
        var ast = acorn.parse(content, acornParseOptions)
        var deps = umd(ast, umdOptions)
        parentDep.children = recursiveDeps.depsFormat(deps, parentDep, rootDep)
        return _getChildren(parentDep.children, rootDep)
      })
    })
  }
  rootDeps = _.flatten([rootDeps])
  return Promise.map(rootDeps, function (rootDep) {
    rootDep = recursiveDeps.depsFormat(rootDep, false, true)
    return _getChildren(rootDep, rootDep[0]).then(function () {
      return rootDep
    })
  }).then(_.flatten)
}

recursiveDeps._flatten = function (rawDeps) {
  return arrExtract(rawDeps, 'children')
}

recursiveDeps._unique = function (flattenedDeps) {
  return _.uniq(flattenedDeps, 'relative')
}

recursiveDeps._groupTypes = function (flattenedDeps) {
  var deps = _.groupBy(flattenedDeps, 'type')
  if (!deps.local) deps.local = []
  if (!deps.npm) deps.npm = []
  if (!deps.native) deps.native = []
  return deps
}

recursiveDeps._mapAuthoredPaths = function (groupedDeps) {
  return _.mapValues(groupedDeps, function (deps) {
    return _.map(deps, function (dep) {
      return dep.original
    })
  })
}

recursiveDeps._mapRelativePaths = function (groupedDeps) {
  return _.mapValues(groupedDeps, function (deps) {
    return _.map(deps, function (dep) {
      return dep.relative
    })
  })
}

recursiveDeps.flat = function () {
  var args = _.values(arguments)
  return recursiveDeps.apply(null, args)
  .then(recursiveDeps._flatten)
}

recursiveDeps.flatUnique = function () {
  var args = _.values(arguments)
  return recursiveDeps.apply(null, args)
  .then(recursiveDeps._flatten)
  .then(recursiveDeps._unique)
}

recursiveDeps.types = function () {
  var args = _.values(arguments)
  return recursiveDeps.apply(null, args)
  .then(recursiveDeps._flatten)
  .then(recursiveDeps._groupTypes)
}

recursiveDeps.mapAuthoredPaths = function () {
  var args = _.values(arguments)
  return recursiveDeps.apply(null, args)
  .then(recursiveDeps._flatten)
  .then(recursiveDeps._groupTypes)
  .then(recursiveDeps._mapAuthoredPaths)
}

recursiveDeps.mapRelativePaths = function () {
  var args = _.values(arguments)
  return recursiveDeps.apply(null, args)
  .then(recursiveDeps._flatten)
  .then(recursiveDeps._unique)
  .then(recursiveDeps._groupTypes)
  .then(recursiveDeps._mapRelativePaths)
}

module.exports = recursiveDeps
