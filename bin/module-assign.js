#!/usr/bin/env node
var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))
var moduleAssign = require('../module-assign')
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
    '--install | -i': 'Installs link modules from package.'
  },
  'options': {
    'name': 'The name of the module. (Only works when one file is passed.)'
  },
  'optionAliases': {
    'name': '-n'
  }
}

var name = argv.n || argv.name || false

if (argv.v || argv.version) {
  console.log(pkg.version)

} else if (argv.i || argv.install) {

  moduleAssign.install()

} else if (name) {

  moduleAssign(argv._[0], name)

} else if (argv._.length) {

  moduleAssign.all(argv._)

} else {

  console.log(binDoc(doc))

}
