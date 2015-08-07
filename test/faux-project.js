var util = require('util')
var _ = require('lodash')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var fauxProject = require('../faux-project')
var chdirTemp = require('../test-chdir-temp')
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

var tests = [
  {
    'one.js': ['underscore']
  },
  {
    'two.js': ['lodash']
  },
  {
    'three.js': ['underscore'],
    'four.js': ['lodash']
  }
]

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  describe('fauxProject.mods()', function () {
    // loop over all tests
    tests.forEach(function (mods) {
      var should = util.format('should create mods %s', _.keys(mods).join(', '))
      it(should, function () {
        // create the modules
        fauxProject.modules(mods)
        _.each(mods, function (mod, key) {
          // get the string value the module should have
          mod = fauxProject.module(mod)
          // read file and assert content
          assert.equal(fs.readFileSync(key, 'utf8'), mod)
        })
      })
    })
  })

})
