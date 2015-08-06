var util = require('util')
var assert = require('assert')
var Promise = require('bluebird')
var child_process = require('child_process')
child_process.execAsync = Promise.promisify(child_process.exec)

/* global describe, it */

describe('node-bin', function () {

  var tests = {
    success: [
      // cmd, expected output
      ['node ./bin/node-bin.js ./test/node-bin-promise.js foo null --type=promise', 'foo'],
      ['node ./bin/node-bin.js ./test/node-bin-promise.js bar null --type=promise', 'bar'],
      ['node ./bin/node-bin.js ./test/node-bin-callback.js foo null --type=callback', 'foo'],
      ['node ./bin/node-bin.js ./test/node-bin-callback.js bar null --type=callback', 'bar'],
      ['node ./bin/node-bin.js ./test/node-bin-sync.js foo null', 'foo'],
      ['node ./bin/node-bin.js ./test/node-bin-sync.js bar null', 'bar'],
      ['node ./bin/node-bin.js ./test/node-bin-promise.js foo --type=promise', 'foo'],
      ['node ./bin/node-bin.js ./test/node-bin-promise.js bar --type=promise', 'bar'],
      ['node ./bin/node-bin.js ./test/node-bin-callback.js foo --type=callback', 'foo'],
      ['node ./bin/node-bin.js ./test/node-bin-callback.js bar --type=callback', 'bar'],
      ['node ./bin/node-bin.js ./test/node-bin-sync.js foo', 'foo'],
      ['node ./bin/node-bin.js ./test/node-bin-sync.js bar', 'bar']
    ]
  }

  tests.success.forEach(function (test) {
    var cmd = test[0]
    var expect = test[1]
    var should = util.format('should return %s given %s', JSON.stringify(expect), cmd)
    it(should, function () {
      return child_process.execAsync(cmd).spread(function (stdout, stderr) {
        stdout = JSON.parse(stdout)
        assert.deepEqual(stdout, expect)
      })
    })
  })

})
