var _ = require('underscore')

/**
 * Builds an object from an array of objects.
 * Orignated in this Stackoverflow post ["Convert array of objects to just one object"]{@link http://stackoverflow.com/questions/20103565/convert-array-of-objects-to-just-one-object}.
 * @param  {Array} arr - An array containing objects.
 * @return {Object} An object where each item in the array is a property and value.
 */
function arrExtend (arr) {
  return _.extend.apply(null, [{}].concat(arr))
}

module.exports = arrExtend
