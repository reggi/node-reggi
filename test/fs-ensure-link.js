var mock = require('mock-fs')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var fsEnsureLink = require('../fs-ensure-link')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

/* global describe, it, before, after */

describe('fs-ensure-link', function () {
  before(function () {
    mock({
      'path/hello.txt': 'file content here',
      'path/bar.txt': 'file content here'
    })
  })
  after(function () {
    mock.restore()
  })
  it('should create link to new folder', function () {
    return fsEnsureLink('path/hello.txt', 'path/to/hello.txt').then(function () {
      return fs.readFileAsync('path/to/hello.txt', 'utf8').should.eventually.equal('file content here')
    })
  })
  it('should create link to root file', function () {
    return fsEnsureLink('path/hello.txt', 'hello.txt').then(function () {
      return fs.readFileAsync('hello.txt', 'utf8').should.eventually.equal('file content here')
    })
  })
  it('should throw error source path does not exist', function () {
    return fsEnsureLink('path/missing.txt', 'hello.txt').should.be.rejectedWith(Error)
  })
  it('should throw error destination path already exists', function () {
    return fsEnsureLink('path/hello.txt', 'path/bar.txt').should.be.rejectedWith(Error)
  })
})
