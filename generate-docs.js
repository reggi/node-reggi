var _ = require('lodash')
var path = require('path')
var Promise = require('bluebird')
var jsdoc2mdAsync = require('./jsdoc2md-async')
var fs = Promise.promisifyAll(require('fs'))
var CWD = process.cwd()

module.exports = function () {
  return fs.readdirAsync(CWD)
  .then(_)
  .call('filter', function (file) {
    var valid = ['.js']
    return _.contains(valid, path.extname(file))
  })
  .call('value')
  .map(function (jsFile) {
    var docFileName = path.basename(jsFile, path.extname(jsFile)) + '.md'
    var docDst = path.join('./docs', docFileName)
    return fs.readFileAsync(jsFile)
    .then(function (src) {
      return jsdoc2mdAsync(src)
    })
    .then(function (doc) {
      return fs.writeFileAsync(docDst, doc)
    })
  })
}
