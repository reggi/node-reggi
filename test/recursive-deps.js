var _ = require('lodash')
var util = require('util')
var assert = require('assert')
var path = require('path')
var assimilate = require('../assimilate')
var chdirTemp = require('../test-chdir-temp')
var fauxProject = require('../faux-project')
var recursiveDeps = require('../recursive-deps')
var tests = require('./data-project-definitions')
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

function fauxRecursiveDeps (options) {
  var root = path.join(options.root)
  var allDeps = _.flattenDeep([options.root, _.keys(options.modules), _.values(options.modules)])
  var expected = _.groupBy(allDeps, function (dep) {
    return recursiveDeps.depType(dep)
  })
  expected.root = [root]
  expected.local = _.chain(options.modules)
    .keys()
    .map(function (dep) {
      return path.join(dep)
    })
    .filter(function (dep) {
      return root !== path.join(dep)
    })
    .value()
  if (!expected.local) expected.local = []
  if (!expected.npm) expected.npm = []
  if (!expected.native) expected.native = []
  if (!expected.invalid) expected.invalid = []
  return expected
}

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  tests.forEach(function (project) {
    var should = util.format('should return recursive deps for %s', project.root)
    it(should, function () {
      fauxProject(project)
      var expected = fauxRecursiveDeps(project)
      return recursiveDeps.mapRelativePaths(project.root).then(function (deps) {
        assert.equal(assimilate(deps), assimilate(expected))
      })
    })
  })

})
