var argx = require('argx')

/**
 * Returns a function that throws an error.
 * @prop {Function} [errorObject] - An Error Object.
 * @prop {Object} [errorInstance] - An instance of an error Object.
 * @prop {String} [message] - A string message for the error.
 */
function fnThrow (/* errorObject, errorInstance, message */) {
  var args = argx(arguments)
  return function () {
    var Fn = args.shift(Function)
    var obj = args.shift(Object)
    var str = args.shift(String)
    if (Fn && str) throw new Fn(str)
    if (obj) throw obj
    if (str) throw new Error(str)
    throw new Error()
  }
}

module.exports = fnThrow
