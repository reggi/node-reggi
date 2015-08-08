var Promise = require('bluebird')
var stream = require('stream')
var jsdoc2md = require('jsdoc-to-markdown')

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

module.exports = jsdoc2mdAsync
