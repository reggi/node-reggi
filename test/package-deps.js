var _ = require('lodash')
var util = require('util')
var assert = require('assert')
var path = require('path')
var chdirTemp = require('../test-chdir-temp')
var fauxProject = require('../faux-project')
var packageDeps = require('../package-deps')
var recursiveDeps = require('../recursive-deps')
var tests = require('./data-project-definitions')
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

function fauxPackageDeps (options) {
  var expected = {}

  options.modules = (options.modules) ? options.modules : []
  options.tests = (options.tests) ? options.tests : []
  options.bin = (options.bin) ? options.bin : []

  var localDeps = [_.values(options.modules), _.values(options.bin)]
  expected.localDeps = _.chain(localDeps)
  .flattenDeep()
  .groupBy(function (dep) {
    return recursiveDeps.depType(dep)
  })
  .value()
  .npm

  expected.testDeps = _.chain(options.tests)
  .values()
  .flattenDeep()
  .groupBy(function (dep) {
    return recursiveDeps.depType(dep)
  })
  .value()
  .npm

  return fauxProject.package(expected.localDeps, expected.testDeps)
}

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  tests.forEach(function (project) {
    var should = util.format('should return packages deps for %s', project.root)
    it(should, function () {
      fauxProject(project)
      var expected = fauxPackageDeps(project)
      return packageDeps.deps(project.root, './package.json').then(function (deps) {
        assert.deepEqual(deps, expected)
      })
    })
  })

})
