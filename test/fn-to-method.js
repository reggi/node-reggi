var chai = require('chai')
var expect = chai.expect
var fnToMethod = require('../fn-to-method')

var anon = {}
anon.ifHappy = function (str) {
  if (str === 'happy') return true
  return false
}

var known = {}
known.ifHappy = function ifHappy (str) {
  if (str === 'happy') return true
  return false
}

function ifHappy (str) {
  if (str === 'happy') return true
  return false
}

var ifHappyAnon = function (str) {
  if (str === 'happy') return true
  return false
}

/* global describe, it */

describe('fn-to-method', function () {
  describe('anon object prop passed as function', function () {
    it('should throw error', function () {
      expect(function () {
        return fnToMethod(anon.ifHappy)
      }).to.throw()
    })
    it('should return expected', function () {
      expect(function () {
        return fnToMethod(anon.ifHappy, 'ifHappy')
      }).to.not.throw()
      var result = fnToMethod(anon.ifHappy, 'ifHappy')
      expect(result).to.have.property('ifHappy', anon.ifHappy)
    })
  })
  describe('anon object prop passed as object', function () {
    it('should return expected', function () {
      expect(function () {
        return fnToMethod('ifHappy', anon)
      }).to.not.throw()
      var result = fnToMethod('ifHappy', anon)
      expect(result).to.have.property('ifHappy', anon.ifHappy)
    })
  })
  describe('known object prop passed as function', function () {
    it('should return expected', function () {
      expect(function () {
        return fnToMethod(known.ifHappy)
      }).to.not.throw()
      var result = fnToMethod(known.ifHappy)
      expect(result).to.have.property('ifHappy', known.ifHappy)
    })
  })
  describe('known object prop passed as object', function () {
    it('should return expected', function () {
      expect(function () {
        return fnToMethod('ifHappy', known)
      }).to.not.throw()
      var result = fnToMethod('ifHappy', known)
      expect(result).to.have.property('ifHappy', known.ifHappy)
    })
  })
  describe('anon function', function () {
    it('should throw error', function () {
      expect(function () {
        return fnToMethod(ifHappyAnon)
      }).to.throw()
    })
    it('should return expected', function () {
      expect(function () {
        return fnToMethod(ifHappyAnon, 'ifHappy')
      }).to.not.throw()
      var result = fnToMethod(ifHappyAnon, 'ifHappy')
      expect(result).to.have.property('ifHappy', ifHappyAnon)
    })
  })
  describe('known function', function () {
    it('should return expected', function () {
      expect(function () {
        return fnToMethod(ifHappy, 'ifHappy')
      }).to.not.throw()
      var result = fnToMethod(ifHappy, 'ifHappy')
      expect(result).to.have.property('ifHappy', ifHappy)
    })
  })
})
