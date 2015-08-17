var assert = require('assert')
var getLine = require('../get-line')

/* global describe, it */

describe('get-line', function () {

  it('should work', function () {

    var file = [
      '# Hello',
      '```javascript',
      'throw new Error(\'Meow.\')',
      '```',
      '```javascript',
      'var assert = require(\'assert\')',
      'var x = false',
      'assert.equal(x, false)',
      '```'
    ].join('\n')

    var test = [
      'var assert = require(\'assert\')',
      'var x = false',
      'assert.equal(x, false)'
    ].join('\n')

    assert.equal(getLine(file, test), 6)

  })

  it('should work', function () {

    var file = [
      '',
      '',
      '',
      '',
      '```javascript',
      'var assert = require(\'assert\')',
      'var x = false',
      'assert.equal(x, false)',
      '```'
    ].join('\n')

    var test = [
      'var assert = require(\'assert\')',
      'var x = false',
      'assert.equal(x, false)'
    ].join('\n')

    assert.equal(getLine(file, test), 6)

  })

  it('should work', function () {

    var file = [
      'var alpha = "hello"',
      'var beta = "hello"',
      'var gamma = "hello"',
      'var delta = "hello"',
      'var episilon = "hello"'
    ].join('\n')

    assert.equal(getLine(file, 'missing'), false)
    assert.equal(getLine(file, 'alpha'), 1)
    assert.equal(getLine(file, 'beta'), 2)
    assert.equal(getLine(file, 'gamma'), 3)
    assert.equal(getLine(file, 'delta'), 4)
    assert.equal(getLine(file, 'episilon'), 5)

  })

  it('should work', function () {

    var file = [
      'var alpha = "hello"',
      'var beta = "hello"',
      'var gamma = "hello"',
      'var delta = "hello"',
      'var episilon = "hello"'
    ].join('\n')

    assert.equal(getLine(file, 'missing'), false)
    assert.equal(getLine(file, 'alpha'), 1)
    assert.equal(getLine(file, 'beta'), 2)
    assert.equal(getLine(file, 'gamma'), 3)
    assert.equal(getLine(file, 'delta'), 4)
    assert.equal(getLine(file, 'episilon'), 5)

  })

})
