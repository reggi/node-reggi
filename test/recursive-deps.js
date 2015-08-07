var CWD = process.cwd()
// var _ = require('lodash')
var util = require('util')
var assert = require('assert')
var path = require('path')
var os = require('os')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var recursiveDeps = require('../recursive-deps')
// var yaml = require('js-yaml')
// var ymlTests = fs.readFileSync(path.join(__dirname, './recursive-deps-tests.yml'), 'utf8')
// var tests = yaml.safeLoad(ymlTests)
// var ymlFiles = fs.readFileSync(path.join(__dirname, './recursive-deps-files.yml'), 'utf8')
// var files = yaml.safeLoad(ymlFiles)
var tests = require('./recursive-deps-tests.json')
var files = require('./recursive-deps-files.json')
//

/* global describe, before, after, beforeEach, afterEach, it */

var ROOT_DESC = 'recursive-deps'
var TEST_DIR = path.join(os.tmpdir(), ROOT_DESC)

function clean (expected) {
  if (!expected.local) expected.local = []
  if (!expected.npm) expected.npm = []
  if (!expected.native) expected.native = []
  return expected
}

describe(ROOT_DESC, function () {

  before(function () {
    fs.emptyDirSync(TEST_DIR)
    process.chdir(TEST_DIR)
  })

  beforeEach(function () {
    return Promise.map(files, function (file) {
      return fs.ensureFileAsync.apply(null, file)
    })
  })

  afterEach(function () {
    fs.emptyDirSync(TEST_DIR)
  })

  after(function () {
    process.chdir(CWD)
    fs.removeSync(TEST_DIR)
  })

  it('should have mock file system', function () {
    assert.equal(process.cwd().indexOf(TEST_DIR) > -1, true)
  })

  tests.forEach(function (test) {
    var should
    var args = test.arguments
    test.authoredPaths = (test.authoredPaths) ? clean(test.authoredPaths) : clean({})
    test.relativePaths = (test.relativePaths) ? clean(test.relativePaths) : test.authoredPaths

    should = util.format('should return deps as authored for %s', args[0])
    it(should, function () {
      return recursiveDeps.mapAuthoredPaths.apply(null, args).then(function (deps) {
        // console.log(JSON.stringify(deps, null, 2))
        assert.deepEqual(deps.local.sort(), test.authoredPaths.local.sort())
        assert.deepEqual(deps.native.sort(), test.authoredPaths.native.sort())
        assert.deepEqual(deps.npm.sort(), test.authoredPaths.npm.sort())
      })
    })

    should = util.format('should return deps relative for %s', args[0])
    it(should, function () {
      return recursiveDeps.mapRelativePaths.apply(null, args).then(function (deps) {
        // console.log(JSON.stringify(deps, null, 2))
        assert.deepEqual(deps.local.sort(), test.relativePaths.local.sort())
        assert.deepEqual(deps.native.sort(), test.relativePaths.native.sort())
        assert.deepEqual(deps.npm.sort(), test.relativePaths.npm.sort())
      })
    })

  })

})
