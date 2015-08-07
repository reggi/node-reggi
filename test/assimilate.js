var assert = require('assert')
var assimilate = require('../assimilate')

/* global describe, it */

describe('assimilate', function () {
  it('should pass arrays', function () {
    var a = ['foo', 'bar']
    var b = ['bar', 'foo']
    assert.equal(assimilate(a), assimilate(b))
  })
  it('should pass collection', function () {
    var a = [{'foo': 'foo'}, {'bar': 'bar'}]
    var b = [{'bar': 'bar'}, {'foo': 'foo'}]
    assert.equal(assimilate(a), assimilate(b))
  })
  it('should pass object', function () {
    var a = {'foo': 'foo', 'bar': 'bar'}
    var b = {'bar': 'bar', 'foo': 'foo'}
    assert.equal(assimilate(a), assimilate(b))
  })
})
