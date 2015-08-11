var path = require('path')
var assert = require('assert')
var promiseTransformStream = require('../promise-transform-stream')
var jsdocParse = require('jsdoc-parse')
var jsdocParseAsync = promiseTransformStream(jsdocParse)
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

describe(DESC, function () {
  it('should transform stream to promise', function () {

    var expected = [{
      'id': 'majestic',
      'longname': 'majestic',
      'name': 'majestic',
      'scope': 'global',
      'kind': 'member',
      'description': 'a wonderful global',
      'order': 0
    }]

    return jsdocParseAsync('/** a wonderful global */ var majestic = true;')
    .then(function (parsed) {
      assert.deepEqual(parsed, expected)
    })

  })
})
