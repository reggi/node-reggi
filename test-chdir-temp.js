var assert = require('assert')
var os = require('os')
var path = require('path')
var fs = require('fs-extra')

/* global it, before, afterEach, after */

module.exports = function (test) {
  var CWD = process.cwd()
  var TEST_DIR = path.join(os.tmpdir(), 'mock-fs')
  GLOBAL.fsmock = true
  before(function () {
    fs.ensureDirSync(TEST_DIR)
    process.chdir(TEST_DIR)
  })

  afterEach(function () {
    fs.emptyDirSync(TEST_DIR)
  })

  after(function () {
    process.chdir(CWD)
    fs.removeSync(TEST_DIR)
  })

  if (test) {
    it('should not equal working directory', function () {
      assert.notEqual(process.cwd(), CWD)
    })
  }

}
