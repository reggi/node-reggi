#!/usr/bin/env node

var minimist = require('minimist')
var _ = require('lodash')
var argv = minimist(process.argv.slice(2))
var moduleBin = require('../module-bin')
var pkg = require('../package.json')

var filePath = (argv.file) ? argv.file : argv._.shift()
var args = argv._

args = _.map(args, function (arg) {
  try {
    return global['eval'](arg)
  } catch (e) {
    arg = "'" + arg + "'"
    return global['eval'](arg)
  }
})

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (filePath) {
  moduleBin(
    filePath,
    args,
    argv['method'],
    argv['type'],
    argv['log'],
    argv['throw'],
    argv['stringify']
  )
} else {
  console.log('module-bin - Run a module from the command line.')
  console.log('')
  console.log('Usage:')
  console.log('  module-bin <file> [args^]               Build module.')
  console.log('  module-bin --help | -h                       Shows this help message.')
  console.log('  module-bin --version | -v                    Show package version.')
  console.log('Options:')
  console.log('  --file         The module to execute, if not available uses first argument.')
  console.log('  --method       Allows you to specify a module function method.')
  console.log('  --type         Allows you to wrap the output of the function (\'promise\' || \'callback\').')
  console.log('  --throw        Allows you to specify whether or not to throw error (default true).')
  console.log('  --log          Allows you to specify whether or not to log result (default true).')
  console.log('  --stringify    Allows you to specify whether or not to json.stringfy log result (default true).')
  console.log('')
}
