// var _ = require('lodash')
// var util = require('util')
var assert = require('assert')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var path = require('path')
var chdirTemp = require('../test-chdir-temp')
var DESC = path.basename(__filename, path.extname(__filename))
var moduleLink = require('../module-link')

/* global describe, it */

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  describe('moduleLink()', function () {
    it('should create module link', function () {
      fs.writeFileSync('./package.json', '{}')
      fs.writeFileSync('./alpha.js')
      fs.mkdirSync('node_modules')
      return moduleLink('./alpha.js').then(function () {
        var moduleDst = fs.readdirSync('node_modules/alpha')
        var modulePkg = fs.readJsonSync('node_modules/alpha/package.json')
        var thisPkg = fs.readJsonSync('package.json')
        assert.deepEqual(moduleDst, ['package.json'])
        assert.deepEqual(modulePkg, {
          'main': '../../alpha.js',
          'name': 'alpha'
        })
        assert.deepEqual(thisPkg, {
          'linkedDependencies': {
            'alpha': './alpha.js'
          }
        })
      })
    })
  })

  describe('moduleLink.all()', function () {
    it('should create module link', function () {
      fs.writeFileSync('./package.json', '{}')
      fs.writeFileSync('./alpha.js')
      fs.mkdirSync('node_modules')
      return moduleLink.all(['./alpha.js']).then(function () {
        var moduleDst = fs.readdirSync('node_modules/alpha')
        var modulePkg = fs.readJsonSync('node_modules/alpha/package.json')
        var thisPkg = fs.readJsonSync('package.json')
        assert.deepEqual(moduleDst, ['package.json'])
        assert.deepEqual(modulePkg, {
          'main': '../../alpha.js',
          'name': 'alpha'
        })
        assert.deepEqual(thisPkg, {
          'linkedDependencies': {
            'alpha': './alpha.js'
          }
        })
      })
    })
  })

  describe('moduleLink.install()', function () {
    it('should link modules from package', function () {
      fs.writeJsonSync('./package.json', {
        'linkedDependencies': {
          'alpha': './alpha.js'
        }
      })
      fs.mkdirSync('node_modules')
      return moduleLink.install().then(function () {
        var moduleDst = fs.readdirSync('./node_modules/alpha')
        var modulePkg = fs.readJsonSync('./node_modules/alpha/package.json')
        assert.deepEqual(moduleDst, ['package.json'])
        assert.deepEqual(modulePkg, {
          'main': '../../alpha.js',
          'name': 'alpha'
        })
      })
    })
  })

})
