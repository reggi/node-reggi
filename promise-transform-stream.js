var Promise = require('bluebird')
var stream = require('stream')

function streamify (text) {
  var s = new stream.Readable()
  s.push(text)
  s.push(null)
  return s
}

function promiseTransformStream (transformStream) {
  return function (str) {
    return new Promise(function (resolve, reject) {
      var text = streamify(str)
      return text.pipe(transformStream())
      .setEncoding('utf8')
      .on('data', function (doc) {
        try {
          return resolve(JSON.parse(doc))
        } catch (e) {
          return resolve(doc)
        }
      })
      .on('error', function (err) {
        return reject(err)
      })
    })
  }
}

module.exports = promiseTransformStream
