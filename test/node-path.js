var path = require('path')
var assert = require('assert')

// pulled from https://nodejs.org/api/path.html#path_path_format_pathobject
/* global describe, it */

describe('node path', function () {

  it('should work as documented', function () {
    assert.equal(path.format({
      root: '/',
      dir: '/home/user/dir',
      base: 'file.txt',
      ext: '.txt',
      name: 'file'
    }), '/home/user/dir/file.txt')
  })

  it('should not work if missing base', function () {
    assert.notEqual(path.format({
      root: '/',
      dir: '/home/user/dir',
      ext: '.txt',
      name: 'file'
    }), '/home/user/dir/file.txt')
  })

  it('should show ext and name are irrevelent', function () {
    assert.equal(path.format({
      root: '/',
      dir: '/home/user/dir',
      ext: '.txt',
      name: 'file'
    }), path.format({
      root: '/',
      dir: '/home/user/dir'
    }))
  })

})
