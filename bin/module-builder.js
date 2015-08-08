#!/usr/bin/env node
var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))
var mainFile = (argv['file']) ? argv['file'] : argv._.shift()
var npmBuildModule = require('../module-builder')
var pkg = require('../package.json')

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (mainFile) {
  npmBuildModule(
    mainFile,
    argv['name'],
    argv['test'],
    argv['docs'],
    argv['local'],
    argv['packages'],
    argv['bin'],
    argv['readme']
  )
} else {
  console.log('module-builder - Build npm module from file')
  console.log('')
  console.log('Usage:')
  console.log('  module-builder <file>                            Build module.')
  console.log('  module-builder --help | -h                       Shows this help message.')
  console.log('  module-builder --version | -v                    Show package version.')
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
