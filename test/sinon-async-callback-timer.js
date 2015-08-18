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

  beforeEach(function () {
    // Overwrite the global timer functions (setTimeout, setInterval) with Sinon fakes
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    // Restore the global timer functions to their native implementations
    this.clock.restore();
  });

  it('should call the callback', function() {
    var spy = sinon.spy();

    callback("tobi", 1000, spy)

    this.clock.tick(999);

    spy.should.have.not.been.called;

    this.clock.tick(1);

    spy.should.have.been.called;

    spy.should.have.been.calledOnce;
  })

  it('should not call the callback', function() {
    var spy = sinon.spy();

    callback("tobi", false, spy)

    this.clock.tick(999);

    spy.should.have.not.been.called;

    this.clock.tick(1);

    spy.should.have.not.been.called;
  })

})
