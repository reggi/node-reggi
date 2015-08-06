var _ = require('lodash')
var path = require('path')
var Promise = require('bluebird')
var acorn = require('acorn')
var umd = require('acorn-umd')
var fs = Promise.promisifyAll(require('fs'))
var arrExtract = require('./arr-extract')

function recursiveDeps (srcpath, localRegex, filterRegex, acornParseOptions, umdOptions, natives) {
  natives = (natives || Object.keys(process.binding('natives')))
  localRegex = (localRegex || /^.\.\/|^.\/|^\//)
  filterRegex = (filterRegex || /\.json$/)
  acornParseOptions = (acornParseOptions || {sourceType: 'module', ecmaVersion: 6, allowHashBang: true})
  umdOptions = (umdOptions || {es6: true, amd: true, cjs: true})

  var src = path.parse(srcpath)
  src.orignal = srcpath

  function depType (dep) {
    if (dep.match(filterRegex)) return 'invalid'
    if (dep.match(localRegex)) return 'local'
    if (_.contains(natives, dep)) return 'native'
    return 'npm'
  }

  function depClense (dep) {
    if (typeof dep === 'string') return dep
    if (dep && dep.source && dep.source.value) return dep.source.value
    if (dep && dep.source && !dep.source.value) return false
    return path.format(dep)
  }

  function depsFormat (deps, parent) {
    return _.chain([deps])
    .flatten()
    .map(function (dep) {
      dep = depClense(dep)
      if (!dep) return false
      var temp = {}
      temp.original = dep
      temp.isRoot = (dep === src.orignal)
      temp.parent = (temp.isRoot) ? '.' : parent
      temp.type = (temp.isRoot) ? 'root' : depType(dep)
      temp.path = path.parse(dep)
      if ((temp.type === 'local' || temp.type === 'root') && temp.path.ext === '') {
        temp.path.base = temp.path.base + src.ext
      }
      temp.path.format = path.format(temp.path)
      temp.relativePath = _.cloneDeep(temp.path)
      if (temp.type === 'local') temp.relativePath.dir = path.join(temp.parent, temp.relativePath.dir)
      temp.relativePath.format = path.format(temp.relativePath)
      temp.traverse = (temp.type === 'local' || temp.type === 'root')
      temp.children = []
      return temp
    })
    .without(false)
    .value()
  }

  function getChildren (deps) {
    function _getChildren (_deps) {
      return Promise.map(_deps, function (dep) {
        if (!dep.traverse) return true
        if (!dep.children) return true
        return fs.readFileAsync(dep.relativePath.format, 'utf8').then(function (content) {
          var ast = acorn.parse(content, acornParseOptions)
          var rawDeps = umd(ast, umdOptions)
          dep.children = depsFormat(rawDeps, path.join(dep.parent, dep.path.dir))
          return _getChildren(dep.children)
        })
      })
    }
    deps = depsFormat(deps)
    return _getChildren(deps).then(function () {
      // console.log(JSON.stringify(deps, null, 2))
      return deps
    })
  }

  return getChildren(src)

}

recursiveDeps._flatten = function (rawDeps) {
  return arrExtract(rawDeps, 'children')
}

recursiveDeps._unique = function (flattenedDeps) {
  return _.uniq(flattenedDeps, 'relativePath.format')
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
      return dep.relativePath.format
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
