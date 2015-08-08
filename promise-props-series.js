var _ = require('lodash')
var Promise = require('bluebird')

function promisePropsSeries (props) {
  var results = {}
  props = _.mapValues(props, function (prop, key) {
    prop.key = key
    return prop
  })
  return Promise.reduce(_.values(props), function (result, action) {
    if (typeof action !== 'function') throw new Error('property values must be functions')
    return Promise.resolve(action()).then(function (value) {
      results[action.key] = value
    })
  }, null)
  .then(function () {
    return results
  })
}

module.exports = promisePropsSeries
