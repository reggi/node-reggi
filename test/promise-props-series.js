// var _ = require('lodash')
// var util = require('util')
var assert = require('assert')
var path = require('path')
var DESC = path.basename(__filename, path.extname(__filename))
var promisePropsSeries = require('../promise-props-series')
var Promise = require('bluebird')
/* global describe, it */

describe(DESC, function () {

  it('should work returning normal strings', function () {
    return promisePropsSeries({
      'alpha': function () {
        return Promise.resolve('alpha')
      },
      'beta': function () {
        return Promise.resolve('beta')
      }
    }).then(function (results) {
      assert.deepEqual(results, {
        'alpha': 'alpha',
        'beta': 'beta'
      })
    })
  })

  it('should work preforming some series operation', function () {
    var x = 0
    return promisePropsSeries({
      'alpha': function () {
        x = x + 5
        return Promise.resolve(x)
      },
      'beta': function () {
        x = x + 10
        return Promise.resolve(x)
      }
    }).then(function (results) {
      assert.deepEqual(results, {
        'alpha': 5,
        'beta': 15
      })
      assert.equal(x, 15)
    })
  })

  it('should throw error when functions aren\'t wrapped', function () {
    var err
    return promisePropsSeries({
      'alpha': Promise.resolve('alpha'),
      'beta': Promise.resolve('beta')
    }).catch(function (error) {
      err = error
    }).then(function () {
      assert.equal(err instanceof Error, true)
    })
  })

})
