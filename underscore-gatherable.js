var _ = require("underscore")

module.exports = {
  makeGatherable: function(){
    var theObj = function(obj) {
      if (obj instanceof theObj) return obj;
      if (!(this instanceof theObj)) return new theObj(obj);
      this._wrapped = obj;
    }
    return theObj
  },
  prototypeGather: function(thObj){
    return function(obj){
      var instance = thObj(obj);
      instance._gather = [];
      return instance
    }
  },
  prototypeGatherBuilder: function(theObj){
    return _.map(_.functions(theObj), function(name) {
      var func = theObj[name];
      theObj.prototype[name] = function() {
        var args = _.values(arguments)
        this._gather.push(func.apply(theObj, args))
        return this
      };
    });
  },
  prototypeGatherValue: function(){
    return function(){
      return this._gather;
    }
  },
  extendGatherable: function(theObj){
    var gatherable = {}
    gatherable.gather = _.prototypeGather(theObj)
    _.extend(theObj, gatherable)
    gatherable.prototype = _.prototypeGatherBuilder(theObj)
    gatherable.prototype.value = _.prototypeGatherValue()
    _.extend(theObj.prototype, gatherable.prototype)
  }
}
