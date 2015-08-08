#!/usr/bin/env node
var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))
var generateDocs = require('../generate-docs')
var pkg = require('../package.json')

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (argv.h || argv.help) {
  console.log('generate-docs - Generate jsdoc2md for each file in current working dir.')
  console.log('')
  console.log('Usage:')
  console.log('  generate-docs            Generates the docs.')
  console.log('')
} else {
  generateDocs()
}
