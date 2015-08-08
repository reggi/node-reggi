var _ = require('lodash')
var Promise = require('bluebird')
var github = require('octonode')

function githubCreateRepo (accessToken, name, description) {
  var client = github.client(accessToken)
  var ghme = client.me();
  var repoAsync = _.bind(Promise.promisify(ghme.repo), ghme)
  var opts = {}
  opts.name = name
  if (description) opts.description = description
  return repoAsync(opts)
}

module.exports = githubCreateRepo
