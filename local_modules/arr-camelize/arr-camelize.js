var _ = require('lodash')
var R = require('ramda')

/**
 * Joins array and camel cases each word
 * @function arrCamelize
 * @param {Array} arr - An array of strings
 * @return {String}
 */
var arrCamelize = R.pipe(R.join(' '), _.camelCase)

module.exports = arrCamelize
