var util = require('util')
var _ = require('lodash')
var fs = require('fs-extra')

/** creates a dummy project in the current directory */
function fauxProject (deps, devDeps, modules, tests, files, bin) {
  if (Array.isArray(deps)) {
    deps = (deps) ? deps : []
    devDeps = (devDeps) ? devDeps : []
    modules = (modules) ? modules : {}
    tests = (tests) ? tests : {}
    files = (files) ? files : {}
    bin = (bin) ? bin : {}
    _.extend(modules, tests)
    _.extend(modules, files)
    _.extend(modules, bin)
  } else {
    var project = deps
    deps = (project.deps) ? project.deps : []
    devDeps = (project.devDeps) ? project.devDeps : []
    modules = (project.modules) ? _.cloneDeep(project.modules) : {}
    tests = (project.tests) ? project.tests : {}
    files = (project.files) ? project.files : {}
    bin = (project.bin) ? project.bin : {}
    _.extend(modules, project.tests)
    _.extend(modules, project.files)
    _.extend(modules, project.bin)
  }
  var pkg = fauxProject.package(deps, devDeps)
  fs.ensureFileSync('package.json', JSON.stringify(pkg))
  fauxProject.modules(modules)
}

/** creates fake modules */
fauxProject.modules = function (modules) {
  modules = (typeof modules === 'string') ? [modules] : modules
  _.each(modules, function (value, key) {
    var mod = fauxProject.module.apply(null, value)
    fs.ensureFileSync(key, mod)
  })
}

/** creates a dummy package object using deps and devDeps */
fauxProject.package = function (deps, devDeps) {
  deps = (deps) ? _.flatten([deps]) : false
  devDeps = (devDeps) ? _.flatten([devDeps]) : false
  var version = '^1.0.0'
  var obj = {}
  if (deps.length) obj.dependencies = fauxProject.deps(deps, version)
  if (devDeps.length) obj.devDependencies = fauxProject.deps(devDeps, version)
  return obj
}

/** inflates array into object using dummy value */
fauxProject.deps = function (arr, value) {
  return _.chain(arr)
  .map(function (item) {
    return [item, value]
  })
  .object()
  .value()
}

/** creates a module */
fauxProject.module = function () {
  var args = _.values(arguments)
  var deps = _.flatten([args])
  var contents = _.map(deps, function (dep) {
    var mod, type
    dep = _.flatten([dep])
    if (dep.length === 1) {
      mod = dep[0]
      type = 'cjs'
    } else {
      mod = dep[0]
      type = dep[1]
    }
    if (type === 'cjs') return util.format('var x = require(\'%s\')', mod)
    if (type === 'es6') return util.format('import x from \'%s\'', mod)
  })
  contents.push('module.exports = false')
  return contents.join('\n')
}

module.exports = fauxProject
