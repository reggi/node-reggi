var _ = require('lodash')

function argsManipulator (defaultArgs, aliasArgs, data) {
  var rootKeys = _.keys(defaultArgs)
  var args = argsManipulator.buildUndefinedKeys(rootKeys)
  var argsAliases = argsManipulator.getAliasKeys(args, aliasArgs)
  var mapAliases = argsManipulator.applyAliases(data, argsAliases)
  _.extend(args, mapAliases)
  return _.pick(args, rootKeys)
}

/** build object from keys with false values */
argsManipulator.buildUndefinedKeys = function (rootKeys) {
  return _.chain(rootKeys)
  .map(function (rootKey) {
    return [rootKey, undefined]
  })
  .object()
  .value()
}

/** get optional key aliases as prop of root key */
argsManipulator.getAliasKeys = function (rootKeys, aliasKeys) {
  return _.chain(rootKeys)
  .mapValues(function (value, rootKey) {
    var aliases = []
    if (aliasKeys[rootKey]) {
      _.each(aliasKeys[rootKey], function (aliasKey) {
        aliases.push(aliasKey)
        aliases.push(aliasKey.toLowerCase())
      })
    }
    aliases.push(rootKey)
    aliases.push(rootKey.toLowerCase())
    return _.unique(aliases)
  })
  .value()
}

/** apply aliases to args false args obj */
argsManipulator.applyAliases = function (obj, argsAliases) {
  return _.chain(argsAliases)
  .mapValues(function (argAliases) {
    var value = _.chain(argAliases)
    .map(function (argAlias) {
      return (obj[argAlias]) ? obj[argAlias] : undefined
    })
    .without(undefined)
    .value()
    return (value[0]) ? value[0] : undefined
  })
  .value()
}

module.exports = argsManipulator
