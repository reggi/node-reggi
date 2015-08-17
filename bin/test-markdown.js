#!/usr/bin/env node
var testMarkdown = require('../test-markdown')
var yargs = require('yargs')
var argv = yargs
  .usage('$0 - Evaluate the javascript in markdown files')
  .example('$0 <file(s)>', 'Evaluate file(s)')
  .example('$0 <file(s)> -n', 'Evaluate file(s) uninterrupted')
  .example('$0 <file(s)> -b', 'Evaluate block(s)')
  .example('$0 <file(s)> -bn', 'Evaluate block(s) uninterrupted')
  .example('$0 <file(s)> -Po', 'Outputs js file(s)')
  .example('$0 <file(s)> -Pio', 'Outputs js file(s) with all block(s) (for linting)')
  .example('$0 <file(s)> -Pob', 'Outputs block(s)')
  .example('$0 <file(s)> -Piob', 'Outputs all blocks(s) (for linting)')
  .default('i', false)
  .alias('i', 'include')
  .describe('i', 'Includes prevented blocks')
  .default('P', false)
  .alias('P', 'prevent')
  .describe('P', 'Prevent code from being evaluated')
  .default('b', false)
  .alias('b', 'block')
  .describe('b', 'Change the scope to block level')
  .default('o', false)
  .alias('o', 'output')
  .describe('o', 'Output js')
  .default('n', false)
  .alias('n', 'nonstop')
  .describe('n', 'Runs all files regardless if error')
  .default('s', false)
  .alias('s', 'silent')
  .describe('s', 'Silence `evalmd` logging')
  .default('u', false)
  .alias('u', 'uniform')
  .describe('u', 'Does not use absolute urls when error logging')
  .default('d', false)
  .alias('d', 'delimeter')
  .describe('d', 'Stdout delimeter')
  .help('h')
  .alias('h', 'help')
  .describe('path', 'Prefix local module with path')
  .default('path', './')
  .describe('package', 'Th path of a package.json')
  .default('package', './package.json')
  .version(function () {
    return require('../package').version
  })
  .wrap(null)
  .argv

var files = argv._

testMarkdown(
  files,
  argv.path,
  argv.uniform,
  argv.nonstop,
  argv.block,
  argv.silent,
  argv.prevent,
  argv.include,
  argv.output,
  argv.delimeter,
  argv.package
).then(function (results) {
  process.exit(results.exitCode)
})
