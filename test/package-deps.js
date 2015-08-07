var assert = require('assert')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()
var _ = require('underscore')
var util = require('util')
var os = require('os')
var path = require('path')
var fse = require('fs-extra')
var fs = require('fs')
var packageDeps = require('../package-deps')
var CWD = process.cwd()

/* global describe, it, before, beforeEach, after, afterEach */

var TEST_DIR = path.join(os.tmpdir(), 'package-deps')

describe('package-deps', function () {

  before(function () {
    fse.emptyDirSync(TEST_DIR)
    process.chdir(TEST_DIR)
  })

  beforeEach(function () {
    fs.writeFileSync('./package.json', (function () {
      return [ '{',
      '  "name": "example-package-deps",',
      '  "version": "0.0.1",',
      '  "description": "Example for testing packageDeps()",',
      '  "devDependencies": {',
      '    "bluebird": "^2.9.34",',
      '    "chai": "^3.2.0",',
      '    "chai-as-promised": "^5.1.0",',
      '    "fs-extra": "reggi/node-fs-extra",',
      '    "jsdoctest": "^1.6.0",',
      '    "mocha": "^2.2.5",',
      '    "mock-fs": "^3.0.0",',
      '    "underscore": "^1.8.3"',
      '  },',
      '  "dependencies": {',
      '    "acorn": "^2.1.0",',
      '    "acorn-umd": "^0.4.0",',
      '    "argx": "^1.1.5",',
      '    "async": "^1.4.0",',
      '    "bluebird": "^2.9.34",',
      '    "data.task": "^3.0.0",',
      '    "fs-extra": "^0.22.1",',
      '    "graceful-fs": "^4.1.2",',
      '    "jsdoctest": "^1.6.0",',
      '    "lodash": "^3.10.0",',
      '    "mocha": "^2.2.5",',
      '    "ramda": "^0.17.1",',
      '    "underscore": "^1.8.3"',
      '  }',
      '}'].join('\n')
    }()))

    fs.writeFileSync('./file-with-local.js', (function () {
      return [
        'var _ = require(\'underscore\')',
        'var Promise = require(\'bluebird\')',
        'var fs = Promise.promisifyAll(require(\'fs\'))',
        'var local = require(\'./local-dep\')'
      ].join('\n')
    }()))

    fs.writeFileSync('./local-dep.js', (function () {
      return [
        'var R = require(\'ramda\')'
      ].join('\n')
    }()))

    fs.writeFileSync('./file-without-local.js', (function () {
      return [
        'var _ = require(\'underscore\')',
        'var Promise = require(\'bluebird\')',
        'var fs = Promise.promisifyAll(require(\'fs\'))'
      ].join('\n')
    }()))

    fs.writeFileSync('./missing-dep.js', (function () {
      return [
        'var $ = require(\'jquery\')'
      ].join('\n')
    }()))

  })

  afterEach(function (done) {
    fse.emptyDir(TEST_DIR, done)
  })

  after(function () {
    process.chdir(CWD)
    fse.removeSync(TEST_DIR)
  })

  var tests = {
    'success': [
      [['./file-with-local.js', './package.json'], {
        dependencies: ['underscore', 'bluebird', 'ramda'],
        devDependencies: []
      }],
      [['./file-without-local.js', './package.json'], {
        dependencies: ['underscore', 'bluebird'],
        devDependencies: []
      }],
      [['./local-dep.js', './package.json'], {
        dependencies: ['ramda'],
        devDependencies: []
      }]
    ],
    'error': [
      [['./missing-dep.js', false, './package.json']]
    ]
  }

  function clenseDeps (pkg) {
    if (Array.isArray(pkg)) return pkg.sort()
    return _.keys(pkg).sort()
  }

  tests.success.forEach(function (test) {
    test[1].dependencies = clenseDeps(test[1].dependencies)
    test[1].devDependencies = clenseDeps(test[1].devDependencies)
  })

  tests.success.forEach(function (test) {
    var args = test[0]
    var expectedResult = test[1]
    var should = util.format('should return expected result %s', JSON.stringify(expectedResult))
    it(should, function () {
      return packageDeps.apply(null, args).then(function (pkg) {
        var devDeps = clenseDeps(pkg.devDependencies)
        var deps = clenseDeps(pkg.dependencies)
        assert.deepEqual(devDeps, expectedResult.devDependencies)
        assert.deepEqual(deps, expectedResult.dependencies)
      })
    })
  })

  tests.error.forEach(function (test) {
    var args = test[0]
    var should = util.format('should reject because insufficient deps')
    it(should, function () {
      return packageDeps.apply(null, args).should.be.rejected
    })
  })

})
