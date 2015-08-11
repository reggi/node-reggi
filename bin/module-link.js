#!/usr/bin/env node
var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))
var moduleLink = require('../module-link')
var pkg = require('../package.json')
var binDoc = require('../bin-doc')

var doc = {
  'name': pkg.name,
  'desc': pkg.description,
  'author': pkg.author,
  'usage': {
    '<files> [<name>]': 'Javascript file.',
    '--help | -h': 'Shows this help message.',
    '--version | -v': 'Show package version.',
    '--install | -i': 'Installs link modules from package.',
    '--all | -a': 'Installs link modules from glob.'
  }
}

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (argv.i || argv.install) {
  moduleLink.install()
} else if (argv.a || argv.all) {
  moduleLink.all(argv._)
} else if (argv._.length) {
  moduleLink.apply(null, argv._)
} else {
  console.log(binDoc(doc))
}
