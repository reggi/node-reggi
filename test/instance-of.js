var util = require('util')
var path = require('path')
var assert = require('assert')
var instanceOf = require('../instance-of')

var tests = [
  ['foo', String],
  ['foo', 'String'],
  ['foo', 'string'],
  [1, Number],
  [1, 'Number'],
  [1, 'number'],
  [0, Number],
  [0, 'Number'],
  [0, 'number'],
  [Infinity, Number],
  [Infinity, 'Number'],
  [Infinity, 'number'],
  [function () {}, Function],
  [function () {}, 'Function'],
  [function () {}, 'function'],
  [{}, Object],
  [{}, 'Object'],
  [{}, 'object'],
  [[], Array],
  [[], 'Array'],
  [[], 'array'],
  [null, null],
  [null, 'Null'],
  [null, 'null'],
  [new Error(), Error],
  [new Error(), 'Error'],
  [new Error(), 'error'],
  [undefined, undefined],
  [undefined, 'Undefined'],
  [undefined, 'undefined'],
  [true, Boolean],
  [true, 'Boolean'],
  [true, 'boolean'],
  [false, Boolean],
  [false, 'Boolean'],
  [false, 'boolean']
]

var error = [
  [1, String],
  ['foo', 'bar'],
  [null, 'string'],
  [1, Function],
  [function () {}, 'Number'],
  [[], 'number'],
  [0, Error],
  [0, 'foo'],
  [{}, 'number'],
  [undefined, Number],
  [undefined, 'Number'],
  [undefined, 'number']
]

var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

describe(DESC, function () {

  tests.forEach(function (args) {
    var should = util.format('should return true when %s', JSON.stringify(args))
    it(should, function () {
      assert.equal(instanceOf.apply(null, args), true)
    })
  })

  error.forEach(function (args) {
    var should = util.format('should return false when %s', JSON.stringify(args))
    it(should, function () {
      assert.equal(instanceOf.apply(null, args), false)
    })
  })

})
