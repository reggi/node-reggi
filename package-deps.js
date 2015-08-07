var path = require('path')
var _ = require('lodash')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var recursiveDeps = require('./recursive-deps')

function packageDeps (file, packageFile) {
  var results = {}
  return recursiveDeps.mapRelativePaths(file)
  .then(function (deps) {
    results.deps = deps
    var scan = _.flattenDeep([deps.local, deps.root])
    var possibleFiles = packageDeps.possibleTestFiles(scan)
    return packageDeps.getExitingFiles(possibleFiles)
  }).then(function (testFiles) {
    results.testFiles = testFiles
    return recursiveDeps.mapRelativePaths(testFiles)
  }).then(function (devDeps) {
    results.devDeps = devDeps
    return fs.readFileAsync(packageFile, 'utf8').then(JSON.parse)
  }).then(function (pkg) {
    results.package = pkg
    return packageDeps.designateDeps(results.deps, results.devDeps, results.package)
  }).then(function (pkgDeps) {
    results.pkgDeps = pkgDeps
    return results
  })
}

packageDeps.deps = function () {
  var args = _.values(arguments)
  return packageDeps.apply(null, args)
  .then(function (results) {
    return results.pkgDeps
  })
}

packageDeps.getExitingFiles = function (files) {
  return Promise.map(files, function (file) {
    return fs.lstatAsync(file).then(function (exists) {
      return file
    }).catch(function () {
      return false
    })
  })
  .then(_)
  .call('chain')
  .call('unique')
  .call('without', false)
  .call('value')
}

/** given an array of files, creates array of possible test file localtions */
packageDeps.possibleTestFiles = function (files) {
  return _.chain([files])
  .flatten()
  .map(function (file) {
    var parse = path.parse(file)
    var format = path.format(parse)
    return [
      path.join('./test/', file),
      path.join('./test/', format),
      path.join('./test/', parse.base),
      path.join('./test/', 'test.' + parse.name + parse.ext),
      path.join('./test/', 'test-' + parse.name + parse.ext),
      path.join('./test/', 'test_' + parse.name + parse.ext),
      path.join('./test/', parse.name + '.test' + parse.ext),
      path.join('./test/', parse.name + '-test' + parse.ext),
      path.join('./test/', parse.name + '_test' + parse.ext),
      path.join('./test/', parse.dir, 'test.' + parse.name + parse.ext),
      path.join('./test/', parse.dir, 'test-' + parse.name + parse.ext),
      path.join('./test/', parse.dir, 'test_' + parse.name + parse.ext),
      path.join('./test/', parse.dir, parse.name + '.test' + parse.ext),
      path.join('./test/', parse.dir, parse.name + '-test' + parse.ext),
      path.join('./test/', parse.dir, parse.name + '_test' + parse.ext),
      path.join('./tests/', file),
      path.join('./tests/', format),
      path.join('./tests/', parse.base),
      path.join('./tests/', 'test.' + parse.name + parse.ext),
      path.join('./tests/', 'test-' + parse.name + parse.ext),
      path.join('./tests/', 'test_' + parse.name + parse.ext),
      path.join('./tests/', parse.name + '.test' + parse.ext),
      path.join('./tests/', parse.name + '-test' + parse.ext),
      path.join('./tests/', parse.name + '_test' + parse.ext),
      path.join('./tests/', parse.dir, 'test.' + parse.name + parse.ext),
      path.join('./tests/', parse.dir, 'test-' + parse.name + parse.ext),
      path.join('./tests/', parse.dir, 'test_' + parse.name + parse.ext),
      path.join('./tests/', parse.dir, parse.name + '.test' + parse.ext),
      path.join('./tests/', parse.dir, parse.name + '-test' + parse.ext),
      path.join('./tests/', parse.dir, parse.name + '_test' + parse.ext)
    ]
  })
  .flatten()
  .value()
}

packageDeps.designateDeps = function (deps, devDeps, pkg) {
  var result = {}

  // get the deps
  result.dependencies = _.chain(deps.npm)
  .map(function (dep) {
    if (pkg.dependencies[dep]) return [dep, pkg.dependencies[dep]]
    return false
  })
  .without(false)
  .object()
  .value()
  var missingDeps = _.difference(deps.npm, _.keys(result.dependencies))
  if (missingDeps.length > 1) throw new Error('missing dependencies: ' + missingDeps.join(', ') + '.')
  if (missingDeps.length === 1) throw new Error('missing dependency: ' + missingDeps.join(', ') + '.')

  // get the dev deps
  result.devDependencies = _.chain(devDeps.npm)
  .filter(function (dep) {
    return !_.contains(_.keys(result.dependencies), dep)
  })
  .map(function (dep) {
    if (pkg.devDependencies[dep]) return [dep, pkg.devDependencies[dep]]
    if (pkg.dependencies[dep]) return [dep, pkg.dependencies[dep]]
    return false
  })
  .without(false)
  .object()
  .value()
  var allDeps = _.flatten([_.keys(result.devDependencies), _.keys(result.dependencies)])
  var missingDevDeps = _.difference(devDeps.npm, allDeps)
  if (missingDevDeps.length > 1) throw new Error('missing devDependencies: ' + missingDevDeps.join(', ') + '.')
  if (missingDevDeps.length === 1) throw new Error('missing devDependency: ' + missingDevDeps.join(', ') + '.')
  if (!_.size(result.devDependencies)) delete result.devDependencies
  return result
}

module.exports = packageDeps
