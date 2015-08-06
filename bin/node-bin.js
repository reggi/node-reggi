#!/usr/bin/env node

var _ = require('lodash')
var dotty = require('dotty')
var path = require('path')
var argv = require('minimist')(process.argv.slice(2))
var modPath = (argv.module) ? argv.module : argv._.shift()
var mod = require(path.join(process.cwd(), modPath))
var fn = (argv.method) ? mod[argv.method] : mod
var args = argv._
var toLog = (argv.stoplog) ? !argv.stoplog : true
var toThrow = (args.stopthrow) ? !args.stopthrow : true
var toStringify = (args.stoplog) ? !args.stoplog : true



args = _.map(args, function (arg) {
  if (arg === 'null') return null
  if (arg === 'true') return true
  if (arg === 'false') return false
  return arg
})

/**
 * --module - the module to execute, if not available uses first argument
 * --method - allows you to specify a module function method
 * --type=('promise'|'callback') - allows you to wrap the output of the function
 * --stopthrow - allows you to specify whether or not to throw error (default true)
 * --stoplog - allows you to specify whether or not to log result (default true)
 * --stopstringify - allows you to specify whether or not to json.stringfy log result (default true)
 */

if (argv.type === 'promise') {
  fn.apply(null, args)
  .then(function (data) {
    if (toLog && toStringify) {
      console.log(JSON.stringify(data))
    } else if (toLog) {
      console.log(data)
    }
  })
  .catch(function (e) {
    if (toThrow) throw e
  })
} else if (argv.type === 'callback') {
  args.push(function (err) {
    if (err instanceof Error) {
      if (toThrow) throw err
    } else {
      var data = _.values(arguments)
      if (data[0] === null) data.shift()
      if (data.length === 1) data = data[0]
      if (toLog && toStringify) {
        console.log(JSON.stringify(data))
      } else if (toLog) {
        console.log(data)
      }
    }
  })
  fn.apply(null, args)
} else {
  try {
    var data = fn.apply(null, args)
    if (toLog && toStringify) {
      console.log(JSON.stringify(data))
    } else if (toLog) {
      console.log(data)
    }
  } catch(e) {
    if (toThrow) throw e
  }
}
