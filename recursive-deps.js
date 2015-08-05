var path = require('path')
var lodash = require('lodash')
var Promise = require('bluebird')
var acorn = require('acorn')
var umd = require('acorn-umd')
var fs = Promise.promisifyAll(require('fs'))
var assign = lodash.assign
var flattenDeep = lodash.flattenDeep
var chain = lodash.chain
var contains = lodash.contains
var filter = lodash.filter
var map = lodash.map
var unique = lodash.unique
var mapValues = lodash.mapValues

/**
 * Goes through Javascript file for file dependenceies.
 * @param  {String} srcpath - The path of the Javascript file.
 * @param  {RegExp} [localRegex] - The regex to base local module discovery after.
 * @param  {RegExp} [filterRegex] - The regex to filter out unwanted module types.
 * @param  {Object} [acornParseOptions] - [Supply options to acorn]{@link https://github.com/marijnh/acorn#main-parser}
 * @param  {Object} [umdOptions] - [Supply options to acorn-umr]{@link https://github.com/megawac/acorn-umd}
 * @param  {Array} [natives] - An array of native node modules
 * @return {Object} {"native": [], "local": [], "npm": []}
 */
function recursiveDeps (srcpath, localRegex, filterRegex, acornParseOptions, umdOptions, natives) {
  natives = (natives || Object.keys(process.binding('natives')))
  localRegex = (localRegex || recursiveDeps.localRegex)
  filterRegex = (filterRegex || recursiveDeps.filterRegex)
  return recursiveDeps.parseFile(srcpath, localRegex, filterRegex, acornParseOptions, umdOptions)
    .then(function (deps) {
      return recursiveDeps.byType(deps, localRegex, filterRegex, natives)
    })
    .then(recursiveDeps.getValues)
}

/**
 * The defaut regex to detect local modules.
 * @type {RegExp}
 */
recursiveDeps.localRegex = /^.\.\/|^.\/|^\//
recursiveDeps.filterRegex = /\.json$/
/**
 * [parseSrc description]
 * @param  {String} src - The string contents of a Javascript file.
 * @param  {Object} [acornParseOptions] - [Supply options to acorn]{@link https://github.com/marijnh/acorn#main-parser}
 * @param  {Object} [umdOptions] - [Supply options to acorn-umr]{@link https://github.com/megawac/acorn-umd}
 * @return {Array} An array object of module defination(s).
 */
recursiveDeps.parseSrc = function parseSrc (src, acornParseOptions, umdOptions) {
  var acornParseDefaults = {sourceType: 'module', ecmaVersion: 6, allowHashBang: true}
  acornParseOptions = assign(acornParseDefaults, acornParseOptions)
  var ast = acorn.parse(src, acornParseOptions)
  return umd(ast, umdOptions)
}

/**
 * Maps and filters out the deps array object for local deps.
 * @param {Array} deps - An array object of module defination(s).
 * @param  {RegExp} [localRegex] - The regex to base local module discovery after.
 * @return {Array} An array of local deps.
 */
recursiveDeps.localDeps = function localDeps (deps, localRegex, filterRegex) {
  localRegex = (localRegex || recursiveDeps.localRegex)
  filterRegex = (filterRegex || recursiveDeps.filterRegex)
  return chain(deps)
    .map(function (dep) {
      return dep.source.value
    })
    .filter(function (dep) {
      if (typeof dep === 'undefined') return false
      return dep.match(localRegex)
    })
    .filter(function (dep) {
      return !dep.match(filterRegex)
    })
    .value()
}

/**
 * Loops over the array of deps recursively.
 * @param  {Array} deps - An array object of module defination(s).
 * @param  {String} srcpath - The string contents of a Javascript file.
 * @param  {RegExp} [localRegex] - The regex to base local module discovery after.
 * @return {Array} An array object of module defination(s).
 */
recursiveDeps.recurse = function recurse (deps, srcpath, localRegex, filterRegex) {
  localRegex = (localRegex || recursiveDeps.localRegex)
  filterRegex = (filterRegex || recursiveDeps.filterRegex)
  var all = []
  function _recurse (deps, srcpath, localRegex) {
    return Promise.map(deps, function (dep) {
      var srcext = path.extname(srcpath)
      var depext = path.extname(dep)
      if (depext === '') dep = dep + srcext
      var deppath = path.join(srcpath, '..', dep)
      return fs.readFileAsync(deppath, 'utf8').then(recursiveDeps.parseSrc)
    }).then(function (newDeps) {
      newDeps = flattenDeep(newDeps)
      console.log(newDeps)
      all.push(newDeps)
      if (!newDeps.length) return all
      var localDeps = recursiveDeps.localDeps(newDeps, localRegex, filterRegex)
      return _recurse(localDeps, srcpath, localRegex, filterRegex)
    })
  }
  return _recurse(deps, srcpath, localRegex)
}

/**
 * Takes a file and fetches all deps
 * @param  {String} srcpath - The path of the Javascript file.
 * @param  {RegExp} [localRegex] - The regex to base local module discovery after.
 * @param  {Object} [acornParseOptions] - [Supply options to acorn]{@link https://github.com/marijnh/acorn#main-parser}
 * @param  {Object} [umdOptions] - [Supply options to acorn-umr]{@link https://github.com/megawac/acorn-umd}
 * @return {Array} An array object of module defination(s).
*/
recursiveDeps.parseFile = function parseFile (srcpath, localRegex, filterRegex, acornParseOptions, umdOptions) {
  localRegex = (localRegex || recursiveDeps.localRegex)
  filterRegex = (filterRegex || recursiveDeps.filterRegex)
  return fs.readFileAsync(srcpath, 'utf8')
    .then(recursiveDeps.parseSrc)
    .then(function (deps) {
      var localDeps = recursiveDeps.localDeps(deps, localRegex)
      if (!localDeps.length) return flattenDeep([deps])
      return recursiveDeps.recurse(localDeps, srcpath, localRegex, filterRegex).then(function (newDeps) {
        return flattenDeep([newDeps, deps])
      })
    })
}

/**
 * Organizes module dependenceies by type `local`, `npm`, and `native`.
 * @param  {Array} deps - An array object of module defination(s).
 * @param  {RegExp} [localRegex] - The regex to base local module discovery after.
 * @param  {Array} [natives] - An array of native node modules
 * @return {Object} Returns array of sorted module object definitions.
 */
recursiveDeps.byType = function byType (deps, localRegex, filterRegex, natives) {
  natives = (natives || Object.keys(process.binding('natives')))
  localRegex = (localRegex || recursiveDeps.localRegex)
  filterRegex = (filterRegex || recursiveDeps.filterRegex)
  var sort = {}

  deps = filter(deps, function (dep) {
    if (typeof dep.source.value === 'undefined') return false
    return true
  })

  sort.local = chain(deps)
  .filter(function (dep) {
    return dep.source.value.match(localRegex)
  })
  .filter(function (dep) {
    return !dep.source.value.match(filterRegex)
  })
  .value()

  sort.native = filter(deps, function (dep) {
    return contains(natives, dep.source.value)
  })

  sort.npm = filter(deps, function (dep) {
    return !dep.source.value.match(localRegex) && !contains(natives, dep.source.value)
  })

  return sort
}

/**
 * Organizes module dependenceies by type `local`, `npm`, and `native`.
 * @param  {Object} sortedDeps - A sotrted object of module defination(s).
 * @return {Object} Returns array of sorted module object definitions containing strings.
 */
recursiveDeps.getValues = function getValues (sortedDeps) {
  return mapValues(sortedDeps, function (sortedDepType) {
    var results = map(sortedDepType, function (sortedDep) {
      return sortedDep.source.value
    })
    return unique(results)
  })
}

module.exports = recursiveDeps
