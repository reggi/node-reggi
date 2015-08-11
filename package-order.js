var _ = require('lodash')

function packageOrder (obj, props) {
  if (!props) props = packageOrder.convention
  var top = _.pick(obj, props)
  var bottom = _.omit(obj, props)
  return _.merge(top, bottom)
}

packageOrder.convention = [
  'name',
  'version',
  'description',
  'main',
  'bin',
  'scripts'
]

module.exports = packageOrder
