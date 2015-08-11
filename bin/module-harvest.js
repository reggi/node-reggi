#!/usr/bin/env node
var _ = require('lodash')
var path = require('path')
var pkg = require('../package.json')
var binDoc = require('../bin-doc')
var argv = require('minimist')(process.argv.slice(2))
var moduleHarvest = require('../module-harvest')
var argsManipulator = require('../args-manipulator')

var doc = {
  'name': path.parse(__filename).name,
  'desc': pkg.description,
  'usage': {
    '<file>': 'Build module.',
    '--help | -h': 'Shows this help message.',
    '--version | -v': 'Show package version.'
  },
  'options': {
    'moduleFile': 'Javascript file to build into module.',
    'moduleName': 'Name of the module. (default: moduleFile name || jsdoc module def name)',
    'moduleDesc': 'Description of the module (default: jsdoc module def summary || jsdoc module def desc)',
    'packageSrc': 'Path to superproject package.json file',
    'localModulesDirName': 'Path to where local modules will build.',
    'directory': 'Path to directory (defaults: "./")',
    'buildLinks': 'Array of src, [src], or [src, dst] hard link definitions, from "./" to `local_module`.',
    'trackDeps': 'Array of src, [src] javascript definitions, from "./" to `local_module`.',
    'trackDevDeps': 'Function returning array of src, [src] javascript testdefinitions, from "./" to `local_module`.',
    'postBuildReverseLinks': 'Array of src, [src], or [src, dst] hard link definitions, from `local_module` to "./".',
    'githubAccessToken': 'Github access token',
    'githubRepoPrefix': 'Github repo prefix (ex: "node-")',
    'preventMerge': 'Boolean option for prevent default merge options.'
  },
  'optionAliases': {
    'moduleFile': ['file'],
    'moduleName': ['name'],
    'moduleDesc': ['desc'],
    'packageSrc': ['package']
  }
}

var args = argsManipulator(moduleHarvest.defaultArgs, doc.optionAliases, argv)
args.moduleFile = (args.moduleFile) ? args.moduleFile : argv._.shift()

if (argv.v || argv.version) {

  console.log(pkg.version)

} else if (args.moduleFile) {

  // get the file to provide to config files
  var file = path.parse(args.moduleFile)
  file.format = path.format(file)

  // get the config arguments
  moduleHarvest.configFileArgs(file)
  .then(function (harvestConfig) {
    // extend args
    _.extend(args, harvestConfig)
    // apply harvest
    return moduleHarvest.apply(null, _.values(args))
  })

} else {

  console.log(binDoc(doc))

}
