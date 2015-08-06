var _ = require('lodash')
var assert = require('assert')

var arrExtract = require('../arr-extract')

/* global describe, it */

describe('arr-extract', function () {

  // http://stackoverflow.com/questions/31829897/convert-recursive-array-object-to-flat-array-object

  it('should work with empty root first child', function () {

    var recursiveArrayObject = [
      {
        'name': 'doctor',
        'car': 'tardis',
        'age': Infinity,
        'profiles': []
      },
      {
        'name': 'bill',
        'car': 'jaguar',
        'age': 30,
        'profiles': [
          {
            'name': 'stacey',
            'car': 'lambo',
            'age': 23,
            'profiles': [
              {
                'name': 'martin',
                'car': 'lexus',
                'age': 34,
                'profiles': []
              }
            ]
          }
        ]
      }
    ]

    var expetedFlattenedArray = [
      {
        'name': 'doctor',
        'car': 'tardis',
        'age': Infinity
      }, {
        'name': 'bill',
        'car': 'jaguar',
        'age': 30
      }, {
        'name': 'stacey',
        'car': 'lambo',
        'age': 23
      }, {
        'name': 'martin',
        'car': 'lexus',
        'age': 34
      }
    ]

    var original = _.cloneDeep(recursiveArrayObject)
    var extracted = arrExtract(recursiveArrayObject, 'profiles')
    extracted = _.sortBy(extracted, 'name')
    expetedFlattenedArray = _.sortBy(expetedFlattenedArray, 'name')
    assert.deepEqual(extracted, expetedFlattenedArray)
    assert.deepEqual(original, recursiveArrayObject)
  })

  it('should work', function () {

    var recursiveArrayObject = [
      {
        'name': 'bill',
        'car': 'jaguar',
        'age': 30,
        'profiles': [
          {
            'name': 'stacey',
            'car': 'lambo',
            'age': 23,
            'profiles': [
              {
                'name': 'martin',
                'car': 'lexus',
                'age': 34,
                'profiles': []
              }
            ]
          }
        ]
      }
    ]

    var expetedFlattenedArray = [
      {
        'name': 'bill',
        'car': 'jaguar',
        'age': 30
      }, {
        'name': 'stacey',
        'car': 'lambo',
        'age': 23
      }, {
        'name': 'martin',
        'car': 'lexus',
        'age': 34
      }
    ]

    var original = _.cloneDeep(recursiveArrayObject)
    var extracted = arrExtract(recursiveArrayObject, 'profiles')
    extracted = _.sortBy(extracted, 'name')
    expetedFlattenedArray = _.sortBy(expetedFlattenedArray, 'name')
    assert.deepEqual(extracted, expetedFlattenedArray)
    assert.deepEqual(original, recursiveArrayObject)
  })

})
