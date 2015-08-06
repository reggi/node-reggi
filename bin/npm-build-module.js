#!/usr/bin/env node

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))
var mainFile = (argv['main-file']) ? argv['main-file'] : argv._.shift()
var npmBuildModule = require('../npm-build-module')
var pkg = require('../package.json')

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (mainFile) {
  npmBuildModule(
    mainFile,
    argv['module-name'],
    argv['test-dir'],
    argv['docs-dir'],
    argv['local-dir'],
    argv['packages-dir'],
    argv['bin-dir'],
    argv['bin-only'],
    argv['readme-name']
  )
} else {
  console.log('npm-build-module - Build npm module from file')
  console.log('')
  console.log('Usage:')
  console.log('  npm-build-module <main-file>                       Build module.')
  console.log('  npm-build-module --help | -h                       Shows this help message.')
  console.log('  npm-build-module --version | -v                    Show package version.')
  console.log('Options:')
  console.log('  --main-file      The javascript file to build into module.')
  console.log('  --module-name    The name of the new module.')
  console.log('  --test-dir       The path of the test directory.')
  console.log('  --docs-dir       The path of the docs directory.')
  console.log('  --local-dir      The path of the new local modules direcotry.')
  console.log('  --packages-dir   The path of the new packages direcotry.')
  console.log('  --bin-dir        The path of bin file direcotry.')
  console.log('  --readme-name    The name for readme files.')
  console.log('  --bin-only       Create a module with a bin file and no main.')
  console.log('')
}
