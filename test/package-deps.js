var _ = require('lodash')
var util = require('util')
var assert = require('assert')
var chdirTemp = require('../test-chdir-temp')
var fauxProject = require('../faux-project')
var packageDeps = require('../package-deps')
var recursiveDeps = require('../recursive-deps')
/* global describe, it */

function fauxPackageDeps (options) {
  var expected = {}

  options.modules = (options.modules) ? options.modules : []
  options.tests = (options.tests) ? options.tests : []

  expected.localDeps = _.chain(options.modules)
  .values()
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

var tests = [
  {
    'deps': ['underscore'],
    'root': './one.js',
    'modules': {
      './one.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './dir/two.js',
    'modules': {
      './dir/two.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './three.js',
    'modules': {
      './three.js': ['./four.js'],
      './four.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './five.js',
    'modules': {
      './five.js': ['./dir/six.js'],
      './dir/six.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './seven.js',
    'modules': {
      './seven.js': ['./eight.js'],
      './eight.js': ['./nine.js'],
      './nine.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './ten.js',
    'modules': {
      './ten.js': ['./dir/eleven.js'],
      './dir/eleven.js': ['./dir/twelve.js'],
      './dir/dir/twelve.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './thirteen.js',
    'modules': {
      './thirteen.js': ['./dir/dir/dir/dir/fourteen.js'],
      './dir/dir/dir/dir/fourteen.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './fifteen.js',
    'modules': {
      './fifteen.js': ['./dir/dir/dir/dir/sixteen.js'],
      './dir/dir/dir/dir/sixteen.js': ['../../../../foo/seventeen.js'],
      './foo/seventeen.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './eighteen.js',
    'modules': {
      './eighteen.js': ['./nineteen.js'],
      './nineteen.js': ['./twenty.js'],
      './twenty.js': ['underscore']
    }
  }
]

describe('package-deps', function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  tests.forEach(function (test) {
    var packageArgs = [test.deps, test.deps]
    test.deps = (test.deps) ? test.deps : []
    test.devDeps = (test.devDeps) ? test.devDeps : []
    test.tests = (test.tests) ? test.tests : {}
    _.extend(test.modules, test.tests)
    var should = util.format('should return recursive deps for %s', test.root)
    it(should, function () {
      fauxProject(packageArgs, test.modules)
      var expected = fauxPackageDeps(test)
      return packageDeps.deps(test.root, './package.json').then(function (deps) {
        assert.deepEqual(deps, expected)
      })
    })
  })

})
