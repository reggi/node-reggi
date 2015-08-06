var _ = require('lodash')
/**
 * Flatten a array-object via recursive property
 * @see {@link http://stackoverflow.com/questions/31829897/convert-recursive-array-object-to-flat-array-object}
 * @param  {Array} arr                Array of objects with recursive props
 * @param  {String} recursiveProperty The string of the recursive property
 * @return {Array}                    Flat array of all recursive properties without recursive property
 */
function arrExtract (arr, recursiveProperty) {
  var extracted = []
  function _arrExtract (children) {
    _.each(children, function (item) {
      if (item[recursiveProperty] && item[recursiveProperty].length) _arrExtract(item[recursiveProperty])
      extracted.push(_.omit(item, recursiveProperty))
    })
  }
  _arrExtract(arr)
  return extracted
}

module.exports = arrExtract
