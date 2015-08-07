var path = require('path')
var assert = require('assert')
var chdirTemp = require('../test-chdir-temp')
var CWD = process.cwd()
var DESC = path.basename(__filename, path.extname(__filename))
/* global describe, it */

describe(DESC, function () {
  chdirTemp(true); if (!GLOBAL.fsmock) throw new Error('no mock')

  it('should not equal working directory with usage', function () {
    assert.notEqual(process.cwd(), CWD)
  })

})
