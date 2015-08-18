var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function callback(name, delay, cb) {
  var returnCallback = delay
  if(!delay) delay = getRandomIntInclusive(1, 700)
  setTimeout(function() {
    if(returnCallback) return cb("hello "+name)
  }, delay);
}

describe('sinnon async callback', function(){

  it('should call the callback but does not', function() {
    var spy = sinon.spy();

    callback("tobi", 1000, spy)

    spy.should.not.have.been.called;
  })

  it('should callback should not call does not work because function is async', function() {
    var spy = sinon.spy();

    callback("tobi", false, spy)

    spy.should.have.not.been.called;

  })

})
