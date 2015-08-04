var _ = require('underscore')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var recursiveDeps = require('./recursive-deps')

function packageDeps (mainFile, testFiles, packageFile) {
  testFiles = (testFiles) ? _.flatten([testFiles]) : [] // force into array
  return Promise.props({
    'package': fs.readFileAsync(packageFile, 'utf8').then(JSON.parse),
    'mainDeps': recursiveDeps(mainFile),
    'testDeps': Promise.map(testFiles, function (testFile) {
      return recursiveDeps(testFile)
    }).then(function (depSets) {
      return _.mapObject(depSets[0], function (set, key) {
        var result = _.chain(depSets)
        .map(function (dep) {
          return _.chain(dep)
          .pick(key)
          .values()
          .value()
        })
        .value()
        return _.flatten(result)
      })
    })
  })
  .then(function (data) {
    data.dependencies = _.chain(data.mainDeps.npm)
    .map(function (dep) {
      if (data.package.dependencies[dep]) return [dep, data.package.dependencies[dep]]
      return false
    })
    .without(false)
    .object()
    .value()
    var missingDeps = _.difference(data.mainDeps.npm, _.keys(data.dependencies))
    if (missingDeps.length > 1) throw new Error('missing dependencies: ' + missingDeps.join(', ') + '.')
    if (missingDeps.length === 1) throw new Error('missing dependency: ' + missingDeps.join(', ') + '.')

    data.devDependencies = _.chain(data.testDeps.npm)
    .filter(function (dep) {
      return !_.contains(_.keys(data.dependencies), dep)
    })
    .map(function (dep) {
      if (data.package.devDependencies[dep]) return [dep, data.package.devDependencies[dep]]
      if (data.package.dependencies[dep]) return [dep, data.package.dependencies[dep]]
      return false
    })
    .without(false)
    .object()
    .value()

    var allDeps = _.flatten([_.keys(data.devDependencies), _.keys(data.dependencies)])
    var missingDevDeps = _.difference(data.testDeps.npm, allDeps)
    if (missingDevDeps.length > 1) throw new Error('missing devDependencies: ' + missingDevDeps.join(', ') + '.')
    if (missingDevDeps.length === 1) throw new Error('missing devDependency: ' + missingDevDeps.join(', ') + '.')
    return data
  })
}

module.exports = packageDeps
