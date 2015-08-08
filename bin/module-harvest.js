#!/usr/bin/env node
var _ = require('lodash')
var minimist = require('minimist')
var util = require('util')
var argv = minimist(process.argv.slice(2))
var moduleHarvest = require('../module-harvest')
var pkg = require('../package.json')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var jsonPath = path.join(process.cwd(), './harvest.json')

function readJson (jsonPath) {
  return fs.lstatAsync(jsonPath)
  .then(function (stat) {
    if (!stat.isFile()) return false
    return fs.readFileAsync(jsonPath)
    .then(function (jsonFile) {
      return JSON.parse(jsonFile)
    })
    .catch(function (err) {
      err.message = util.format('malformed json file %s: %s', jsonPath, err.message)
      throw err
    })
  })
}

readJson(jsonPath).then(function (harvestConfig) {
  if (harvestConfig) _.extend(argv, harvestConfig)

  var args = {
    moduleFile: ['file'],
    moduleName: ['name'],
    packageDesc: ['desc'],
    testDir: ['test'],
    docsDir: ['docs'],
    localDir: ['local'],
    binDir: ['bin'],
    packagesDir: ['packages'],
    packageFile: ['package'],
    readmeName: ['readme'],
    githubAccessToken: false,
    githubRepoPrefix: false
  }

  args = _.mapValues(args, function (argOptions, key) {
    if (!argOptions) argOptions = []
    argOptions.push(key)
    argOptions.push(key.toLowerCase())
    var value = _.chain(argOptions)
    .map(function (option) {
      return (argv[option]) ? argv[option] : false
    })
    .without(false)
    .value()
    return (value[0]) ? value[0] : false
  })

  args.moduleFile = (args.moduleFile) ? args.moduleFile : argv._.shift()

  if (argv.v || argv.version) {
    console.log(pkg.version)
  } else if (args.moduleFile) {
    moduleHarvest.apply(null, _.values(args))
  } else {
    console.log('module-harvest - Harvest pieces of npm module from single file.')
    console.log('')
    console.log('Usage:')
    console.log('  module-harvest <file>                            Build module.')
    console.log('  module-harvest --help | -h                       Shows this help message.')
    console.log('  module-harvest --version | -v                    Show package version.')
    console.log('Options:')
    console.log('  --file           The javascript file to build into module.')
    console.log('  --name           The name of the new module.')
    console.log('  --test           The path of the test directory.')
    console.log('  --docs           The path of the docs directory.')
    console.log('  --local          The path of the new local modules direcotry.')
    console.log('  --packages       The path of the new packages direcotry.')
    console.log('  --bin            The path of bin file direcotry.')
    console.log('  --readme         The name for readme files.')
    console.log('')
  }

})
