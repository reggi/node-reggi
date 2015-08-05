var assert = require('assert')
var _ = require('underscore')
var util = require('util')
var os = require('os')
var path = require('path')
var Promise = require('bluebird')
var fse = Promise.promisifyAll(require('fs-extra'))
var fs = require('fs')
var npmBuildModule = require('../npm-build-module')
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

    fse.ensureFileSync('./file-with-local.js', (function () {
      return [
        'var _ = require(\'underscore\')',
        'var Promise = require(\'bluebird\')',
        'var fs = Promise.promisifyAll(require(\'fs\'))',
        'var local = require(\'./local-dep\')'
      ].join('\n')
    }()))

    fse.ensureFileSync('./docs/file-with-local.md', (function () {
      return [
        '# Some Documentation',
        'Some Paragraph'
      ].join('\n')
    }()))

    fse.ensureFileSync('./test/file-with-local.js', (function () {
      return [
        '// Some test file'
      ].join('\n')
    }()))

    fse.ensureFileSync('./test/test-dependant.js', (function () {
      return [
        'var R = require(\'ramda\')'
      ].join('\n')
    }()))

    fse.ensureFileSync('./test/file-with-test-local-dep.js', (function () {
      return [
        // this should pull "./test/test-dependant.js" and not "./test-dependant.js"
        'var testDependant = require("./test-dependant.js")'
      ].join('\n')
    }()))

    fse.ensureFileSync('./local-dep.js', (function () {
      return [
        'var R = require(\'ramda\')'
      ].join('\n')
    }()))

    fse.ensureFileSync('./file-without-local.js', (function () {
      return [
        'var _ = require(\'underscore\')',
        'var Promise = require(\'bluebird\')',
        'var fs = Promise.promisifyAll(require(\'fs\'))'
      ].join('\n')
    }()))

    fse.ensureFileSync('./file-with-test-local-dep.js', (function () {
      return [
        'var _ = require(\'underscore\')',
        'var Promise = require(\'bluebird\')',
        'var fs = Promise.promisifyAll(require(\'fs\'))'
      ].join('\n')
    }()))

    fse.ensureFileSync('./missing-dep.js', (function () {
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

  function verifyLinkOrSymlink (src, dst) {
    var srcStat = fs.lstatSync(src)
    var dstStat = fs.lstatSync(dst)
    if (srcStat.isFile() && (dstStat.isFile() || dstStat.isSymbolicLink())) {
      var srcContent = fs.readFileSync(src, 'utf8')
      var dstContent = fs.readFileSync(dst, 'utf8')
      return [srcContent, dstContent]
    }else if (srcStat.isDirectory() && (dstStat.isDirectory() || dstStat.isSymbolicLink())) {
      var srcContents = fs.readdirSync(src)
      var dstContents = fs.readdirSync(dst)
      return [srcContents, dstContents]
    }
  }

  function clenseDeps (pkg) {
    if (Array.isArray(pkg)) return pkg.sort()
    return _.keys(pkg).sort()
  }

  var tests = [
    ['./file-with-local.js', {
      test: true,
      docs: true,
      localDependencies: ['./local-dep.js'],
      localDevDependencies: [],
      dependencies: ['underscore', 'bluebird', 'ramda'],
      devDependencies: []
    }],
    ['./file-without-local.js', {
      test: false,
      docs: false,
      localDependencies: [],
      localDevDependencies: [],
      dependencies: ['underscore', 'bluebird'],
      devDependencies: []
    }],
    ['./file-with-test-local-dep.js', {
      test: true,
      docs: false,
      localDependencies: [],
      localDevDependencies: ['./test/test-dependant.js'],
      dependencies: ['underscore', 'bluebird'],
      devDependencies: ['ramda']
    }]
  ]

  tests.forEach(function (test) {
    var src = test[0]
    var expected = test[1]
    var should = util.format('should build module %s', src)
    it(should, function () {
      var file = path.basename(src)
      var fileName = path.basename(file, path.extname(file))
      return npmBuildModule(src).then(function () {

        // files and dirs
        assert.equal(fs.lstatSync('./local_modules').isDirectory(), true)
        assert.equal(fs.lstatSync('./local_modules/' + fileName).isDirectory(), true)

        if (expected.test) assert.equal(fs.lstatSync('./local_modules/' + fileName + '/test').isDirectory(), true)
        // links
        assert.equal(fs.lstatSync('./local_modules/' + fileName + '/' + file).isFile(), true)
        assert.equal.apply(null, verifyLinkOrSymlink('./' + file, './local_modules/' + fileName))
        if (expected.test) assert.equal.apply(null, verifyLinkOrSymlink('./test/' + file, './local_modules/' + fileName + '/test/' + file))
        if (expected.docs) assert.equal.apply(null, verifyLinkOrSymlink('./docs/' + fileName + '.md', './local_modules/' + fileName + '/readme.md'))
        assert.equal.apply(null, verifyLinkOrSymlink('./' + file, './local_modules/' + fileName + '/' + file))

        expected.localDependencies.forEach(function (dep) {
          assert.equal.apply(null, verifyLinkOrSymlink(dep, path.join('./local_modules/' + fileName, dep)))
        })

        expected.localDevDependencies.forEach(function (dep) {
          assert.equal.apply(null, verifyLinkOrSymlink(dep, path.join('./local_modules/' + fileName, dep)))
        })

        // symlink
        assert.equal.apply(null, verifyLinkOrSymlink('./node_modules/' + fileName, './local_modules/' + fileName))
        // package
        var packageJson = fs.readFileSync('./local_modules/' + fileName + '/package.json')
        packageJson = JSON.parse(packageJson)
        assert.deepEqual(clenseDeps(packageJson.devDependencies), clenseDeps(expected.devDependencies))
        assert.deepEqual(clenseDeps(packageJson.dependencies), clenseDeps(expected.dependencies))
      })
    })
  })
})
