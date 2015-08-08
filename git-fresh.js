// var harvestOptions = ho = require('./harvest.json')
// var Promise = require('bluebird')
// npm publish
// # replacement for gits attach
// append to .gitsalve >> assigned local_modules/<mod>

var util = require('util')
var Promise = require('bluebird')
var fs = Promise.promsifyAll(require('fs-extra'))
var githubApi = require('octonode')
var git = require('simple-git')
var path = require('path')

function moduleGithub (githubAccessToken, repoPrefix, repoSrc) {
  var github = githubApi.client(githubAccessToken)
  Promise.promisifyAll(github)
  var pkgSrc = path.join(repoSrc, 'package.json')
  return fs.readJsonAsync(pkgSrc)
  .then(function (pkg) {
    if (!pkg.name) throw new Error(util.format('missing package name %s', pkgSrc))
    var repoName = (repoPrefix) ? repoPrefix + pkg.name : pkg.name
    return github.repoAsync({'name': repoName})
  })
  .then(function (repo) {
    return git(repoSrc)
      .init()
      .add('./*')
      .commit('init')
      .addRemote('origin', repo)
      .push('origin', 'master')
  })
}

module.exports = moduleGithub
