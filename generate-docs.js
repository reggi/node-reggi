var _ = require('lodash')
var path = require('path')
var jsdoc2md = require('jsdoc-to-markdown')
var Promise = require('bluebird')
var stream = require('stream')
var fs = Promise.promisifyAll(require('fs'))
var CWD = process.cwd()

function streamify (text) {
  var s = new stream.Readable()
  s.push(text)
  s.push(null)
  return s
}

function jsdoc2mdAsync (str) {
  return new Promise(function (resolve, reject) {
    var text = streamify(str)
    var doc = text.pipe(jsdoc2md())
    doc.setEncoding('utf8')
    doc.on('data', function (doc) {
      return resolve(doc)
    })
    doc.on('error', function (err) {
      return reject(err)
    })
  })
}

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
