var chai = require('chai')
var expect = chai.expect

var arrCamelize = require('../arr-camelize')

/* global describe, it */

describe('arr-camelize', function () {
  it('should join array and camel case each item', function () {
    expect(arrCamelize(['hello', 'world'])).to.equal('helloWorld')
    expect(arrCamelize(['foo', 'bar'])).to.equal('fooBar')
    expect(arrCamelize(['Foo', 'bar'])).to.equal('fooBar')
    expect(arrCamelize(['Foo', 'bar', 'baz'])).to.equal('fooBarBaz')
    expect(arrCamelize(['Foo', 'bar', 'Baz'])).to.equal('fooBarBaz')
  })
})
