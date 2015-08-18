var _ = require("underscore")

module.exports = {
  makeChainable: function(){
    var theObj = function(obj) {
      if (obj instanceof theObj) return obj;
      if (!(this instanceof theObj)) return new theObj(obj);
      this._wrapped = obj;
    }
    return theObj
  },
  prototypeChain: function(thObj){
    return function(obj){
      var instance = thObj(obj);
      instance._chain = true;
      return instance
    }
  },
  prototypeChainBuilder: function(theObj){
    var chainResult = function(instance, obj) {
      return instance._chain ? theObj(obj).chain() : obj;
    }
    return _.map(_.functions(theObj), function(name) {
      var func = theObj[name];
      theObj.prototype[name] = function() {
        var args = [this._wrapped];
        Array.prototype.push.apply(args, arguments);
        return chainResult(this, func.apply(theObj, args));
      };
    });
  },
  prototypeChainValue: function(){
    return function(){
      return this._wrapped;
    }
  },
  extendChainable: function(theObj){
    var chainable = {}
    chainable.chain = _.prototypeChain(theObj)
    _.extend(theObj, chainable)
    chainable.prototype = _.prototypeChainBuilder(theObj)
    chainable.prototype.value = _.prototypeChainValue()
    _.extend(theObj.prototype, chainable.prototype)
  }
}
