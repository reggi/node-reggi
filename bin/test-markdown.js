#!/usr/bin/env node
var minimist = require('minimist')
// var _ = require('lodash')
var argv = minimist(process.argv.slice(2))
var testMarkdown = require('../test-markdown')
var pkg = require('../package.json')

var filePath = (argv.file) ? argv.file : argv._.shift()

var doc = {
  'name': pkg.name,
  'desc': pkg.description,
  'usage': {
    '<file|directory>': 'File or directory of markdown files to test.'
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
    'packageSrc': ['package', 'pkg']
  }
}

if (argv.v || argv.version) {
  console.log(pkg.version)
} else if (filePath) {
  testMarkdown(filePath)
} else {

}
