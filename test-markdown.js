var _ = require('lodash')
var path = require('path')
var Entities = require('html-entities').AllHtmlEntities
var cheerio = require('cheerio')
var marked = require('marked')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var markedAsync = Promise.promisify(marked)
var _eval = require('eval')
var entities = new Entities()

function testMarkdown (prividedPath) {
  return fs.lstatAsync(prividedPath)
  .then(function (stats) {
    if (stats.isFile()) {
      return testMarkdown.files(prividedPath)
    } else if (stats.isDirectory()) {
      return fs.readdirAsync(prividedPath)
      .then(function (files) {
        return testMarkdown.prependPaths(files, prividedPath)
      })
      .then(testMarkdown.files)
    }
  }).then(function () {
    return process.exit()
  })
}

testMarkdown.prependPaths = function (files, dir) {
  return _.map(files, function (file) {
    return path.join(dir, file)
  })
}

testMarkdown.files = function (files) {
  files = _.flatten([files])
  return Promise.map(files, function (file) {
    return fs.readFileAsync(file, 'utf8')
    .then(markedAsync)
    .then(testMarkdown.getJsFromHTML)
    .then(entities.decode)
    .then(function (code) {
      return _eval(code, path.parse(file).name, {}, true)
    })
  })
}

testMarkdown.getJsFromHTML = function (mdContent) {
  var $ = cheerio.load(mdContent, {decodeEntities: false})
  var code = $('code.lang-javascript')
  var codeHtml = []
  code.map(function () {
    codeHtml.push($(this).html())
  })
  return codeHtml.join('\n')
}

module.exports = testMarkdown
