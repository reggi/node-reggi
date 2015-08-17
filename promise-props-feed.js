var _ = require('lodash')
var Promise = require('bluebird')

function promisePropsFeed (start, props) {
  var results = {}
  props = _.mapValues(props, function (prop, key) {
    prop.key = key
    return prop
  })
  return Promise.reduce(_.values(props), function (result, action) {
    if (typeof action !== 'function') throw new Error('property values must be functions')
    return Promise.resolve(action(result)).then(function (value) {
      results[action.key] = value
      return value
    })
  }, start)
  .then(function () {
    return results
  })
}

module.exports = promisePropsFeed

// promisePropsFeed('cookie', {
//   'alpha': alpha,
//   'beta': beta,
//   'gamma': gamma,
//   'delta': delta
// }).then(function (a){
//   console.log(a)
// })
