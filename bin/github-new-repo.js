#!/usr/bin/env node
var yargs = require('yargs')
var fs = require('fs')
var githubNewRepo = require('../github-new-repo')
var argv = yargs
  .usage('$0 - Create a new github repository')
  .default('t', process.env.GITHUB_TOKEN)
  .describe('t', 'Github token')
  .alias('t', 'token')
  .demand('n')
  .describe('n', 'Repository name')
  .alias('n', 'name')
  .default('d', false)
  .describe('d', 'Repository description')
  .alias('d', 'desc')
  .version(function () {
    return fs.readFileSync('../package.json').version
  })
  .wrap(null)
  .argv

githubNewRepo(argv.token, argv.name, argv.desc)
  .then(function (data) {
    console.log(JSON.stringify(data, null, 2))
    process.exit(0)
  })
  .catch(function (e) {
    console.log(e.message)
    process.exit(1)
  })
