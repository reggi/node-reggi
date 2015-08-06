var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

var expect = chai.expect

var mock = require('mock-fs')

var recursiveDeps = require('../recursive-deps')

/* global describe, before, after, it */

describe('recursive-deps', function () {
  before(function () {
    mock({
      'hello.js': '',
      'folder': {
        'file-require-local.js': 'var local = require("../file-require-sibling.js")'
      },
      'file-require-sibling.js': 'var local = require("./file-require-underscore.js")',
      'file-require-underscore.js': 'var underscore = require("underscore")',
      'file-import-underscore.js': 'import underscore from "underscore"',
      'file-require-path.js': 'var path = require("path")',
      'file-import-path.js': 'import path from "path"',
      'file-require-local.js': 'var hello = require("./hello.js")',
      'file-import-local.js': 'import hello from "./hello.js"',
      'file-require-json.js': 'var pkg = require("./package.json")',
      'file-multi-file.js': (function () {
        var file = []
        file.push('var underscore = require("underscore")')
        file.push('var path = require("path")')
        file.push('var hello = require("./hello.js")')
        return file.join('\n')
      }())
    })
  })
  after(function () {
    mock.restore()
  })

  it('should track nested dep', function () {
    return recursiveDeps.typeString('folder/file-require-local.js').then(function (value) {
      console.log(value)
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.deep.equal([
        'file-require-sibling.js',
        'file-require-underscore.js'
      ])
      expect(value.native).to.be.empty
      expect(value.npm).to.deep.equal([
        'underscore'
      ])
    })
  })
  it('should track down one npm dependency using require', function () {
    return recursiveDeps.typeString('file-require-json.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.be.empty
      expect(value.native).to.be.empty
      expect(value.npm).to.be.empty
    })
  })
  it('should track down one npm dependency using require', function () {
    return recursiveDeps.typeString('file-require-underscore.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.be.empty
      expect(value.native).to.be.empty
      expect(value.npm).to.have.length(1)
      expect(value.npm).to.contain('underscore')
    })
  })
  it('should track down one npm dependency using import', function () {
    return recursiveDeps.typeString('file-import-underscore.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.be.empty
      expect(value.native).to.be.empty
      expect(value.npm).to.have.length(1)
      expect(value.npm).to.contain('underscore')
    })
  })
  it('should track down one native dependency using require', function () {
    return recursiveDeps.typeString('file-require-path.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.be.empty
      expect(value.npm).to.be.empty
      expect(value.native).to.have.length(1)
      expect(value.native).to.contain('path')
    })
  })
  it('should track down one native dependency using import', function () {
    return recursiveDeps.typeString('file-import-path.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.be.empty
      expect(value.npm).to.be.empty
      expect(value.native).to.have.length(1)
      expect(value.native).to.contain('path')
    })
  })
  it('should track down one local dependency using require', function () {
    return recursiveDeps.typeString('file-require-local.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.npm).to.be.empty
      expect(value.native).to.be.empty
      expect(value.local).to.have.length(1)
      expect(value.local).to.contain('./hello.js')
    })
  })
  it('should track down one local dependency using import', function () {
    return recursiveDeps.typeString('file-import-local.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.npm).to.be.empty
      expect(value.native).to.be.empty
      expect(value.local).to.have.length(1)
      expect(value.local).to.contain('./hello.js')
    })
  })
  it('should track down 3 dependencies one of each type', function () {
    return recursiveDeps.typeString('file-multi-file.js').then(function (value) {
      expect(value).to.have.deep.property('npm')
      expect(value).to.have.deep.property('local')
      expect(value).to.have.deep.property('native')
      expect(value.local).to.have.length(1)
      expect(value.local).to.contain('./hello.js')
      expect(value.native).to.have.length(1)
      expect(value.native).to.contain('path')
      expect(value.npm).to.have.length(1)
      expect(value.npm).to.contain('underscore')
    })
  })
})
