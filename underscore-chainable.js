var _ = require('underscore')

module.exports = {
  makeChainable: function () {
    var TheObj = function (obj) {
      if (obj instanceof TheObj) return obj
      if (!(this instanceof TheObj)) return new TheObj(obj)
      this._wrapped = obj
    }
    return TheObj
  },
  prototypeChain: function (thObj) {
    return function (obj) {
      var instance = thObj(obj)
      instance._chain = true
      return instance
    }
  },
  prototypeChainableBuilder: function (theObj) {
    var chainResult = function (instance, obj) {
      return instance._chain ? theObj(obj).chain() : obj
    }
    return _.map(_.functions(theObj), function (name) {
      var func = theObj[name]
      theObj.prototype[name] = function () {
        var args = [this._wrapped]
        Array.prototype.push.apply(args, arguments)
        return chainResult(this, func.apply(theObj, args))
      }
    })
  },
  prototypeChainableValue: function () {
    return function () {
      return this._wrapped
    }
  },
  extendChainable: function (theObj) {
    var chainable = {}
    chainable.chain = _.prototypeChain(theObj)
    _.extend(theObj, chainable)
    chainable.prototype = _.prototypeChainableBuilder(theObj)
    chainable.prototype.value = _.prototypeChainableValue()
    _.extend(theObj.prototype, chainable.prototype)
  }
}
