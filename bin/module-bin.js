#!/usr/bin/env node

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))
var moduleBin = require('../module-bin')
var pkg = require('../package.json')

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (argv.h || argv.help) {
  console.log('module-bin - Run a module from the command line.')
  console.log('')
  console.log('Usage:')
  console.log('  module-bin <main-file> [args^]               Build module.')
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
} else {

  var filePath = (argv.file) ? argv.file : argv._.shift()
  var args = argv._

  moduleBin(
    filePath,
    args,
    argv['method'],
    argv['type'],
    argv['log'],
    argv['throw'],
    argv['stringify']
  )

}
