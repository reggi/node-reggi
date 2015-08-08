var util = require('util')
var _ = require('lodash')
var path = require('path')

/**
 * Proxy the execution of an entire node module.
 * @param  {String} filePath         Path to main javascript file.
 * @param  {Array} args              Array of arguments to apply to the function.
 * @param  {String} [functionMethod] String of specific function method to execute
 * @param  {String} [type]           Type of function to run (promise||callback)
 * @param  {Boolean} [toLog]         Option to log the output (defaults true).
 * @param  {Boolean} [toThrow]       Option to throw error (defaults true).
 * @param  {Boolean} [toStringify]   Option to JSON.stringify output (defaults true).
 */
function moduleBin (filePath, args, functionMethod, type, toLog, toThrow, toStringify) {
  var cwd = process.cwd()
  toLog = (toLog) ? toLog : true
  toThrow = (toThrow) ? toThrow : true
  toStringify = (toStringify) ? toStringify : true

  var exportedModule = require(path.join(cwd, filePath))

  if (functionMethod && !exportedModule[functionMethod]) {
    throw new Error(util.format('no function method \'%s\' found ', functionMethod))
  }

  var fn = (functionMethod) ? exportedModule[functionMethod] : exportedModule

  args = _.map(args, function (arg) {
    if (arg === 'null') return null
    if (arg === 'true') return true
    if (arg === 'false') return false
    return arg
  })

  if (type === 'promise') {
    return fn.apply(null, args)
    .then(function (data) {
      if (toLog && toStringify) {
        console.log(JSON.stringify(data, null, 2))
      } else if (toLog) {
        console.log(data)
      }
    })
    .catch(function (e) {
      if (toThrow) throw e
    })
  } else if (type === 'callback') {
    args.push(function (err) {
      if (err instanceof Error) {
        if (toThrow) throw err
      } else {
        var data = _.values(arguments)
        if (data[0] === null) data.shift()
        if (data.length === 1) data = data[0]
        if (toLog && toStringify) {
          console.log(JSON.stringify(data, null, 2))
        } else if (toLog) {
          console.log(data)
        }
      }
    })
    return fn.apply(null, args)
  } else {
    try {
      var data = fn.apply(null, args)
      if (toLog && toStringify) {
        console.log(JSON.stringify(data, null, 2))
      } else if (toLog) {
        console.log(data)
      }
      return data
    } catch(e) {
      if (toThrow) throw e
    }
  }
}

module.exports = moduleBin
