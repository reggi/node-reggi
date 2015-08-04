var chai = require('chai')
var expect = chai.expect

var _ = require('underscore')
_.mixin(require('../underscore-gatherable'))

var middleware = _.makeGatherable()

middleware.next = function () {
  return function (req, res, next) {
    return next()
  }
}

middleware.json = function () {
  return function (req, res, next) {
    return res.json({'name': 'tobi'})
  }
}

_.extendGatherable(middleware)

/* global describe, it */

describe('underscore-gatherable', function () {
  it('should still retain function method values', function () {
    var use = [
      middleware.next(),
      middleware.json()
    ]
    expect(use).to.have.length(2)
    expect(use[0]).to.be.instanceof(Function)
    expect(use[1]).to.be.instanceof(Function)
  })
  it('should still be gatherable', function () {
    var use = middleware
      .gather()
      .next()
      .json()
      .value()
    expect(use).to.have.length(2)
    expect(use[0]).to.be.instanceof(Function)
    expect(use[1]).to.be.instanceof(Function)
  })
})
