var _ = require("underscore")
var Promise = require("bluebird")
Promise.prototype.always = function(fn){return this.then(fn, fn)}
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
var expect = chai.expect
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
chai.use(chaiAsPromised)
chai.should()

var example = function(throwError){
  return Promise.resolve(throwError).then(function(){
    if(throwError) throw new Error("test error")
    return throwError
  })
}

describe("bluebird's promise", function(){

  it("should produce desired result return rejectedWith error", function(done){
    example(true).should.eventually.be.rejectedWith(Error, "test error").notify(done)
  })

  it("should produce desired result return equal false", function(done){
    example(false).should.eventually.be.equal(false).notify(done)
  })

  it("should produce desired result .catch() expect error object", function(done){
    example(true).catch(function(value){
      expect(value).to.exist
        .and.be.instanceof(Error)
        .and.have.property('message', 'test error')
    }).then(done)
  })

  it("should produce desired result .catch() should be called", function(done){
    var spy = sinon.spy();
    example(true).catch(spy).then(function(){
      expect(spy).to.have.been.called
    }).then(done).catch(done)
  })

  it("should produce desired result promise does not throw error", function(){
    expect(function(){
      return example(true)
    }).to.not.throw
  })

  it("should produce desired result .catch() does not throw error", function(){
    expect(function(){
      return example(true).catch()
    }).to.not.throw
  })

  it("should produce undesired result .reflect() does not throw error", function(){
    expect(function(){
      return example(true).reflect()
    }).to.not.throw
  })

  it("should produce undesired result .reflect() should be called", function(done){
    var spy = sinon.spy();
    example(true).reflect(spy).then(function(){
      expect(spy).to.have.not.been.called
    }).then(done).catch(done)
  })

  it("should produce undesired result .finally() throws error", function(){
    expect(function(){
      return example(true).finally()
    }).to.throw
  })

  it("should produce undesired result .done() throws error", function(){
    expect(function(){
      return example(true).done()
    }).to.throw
  })

  it("should produce desired result .always() expect error object ", function(done){
    example(true).always(function(value){
      expect(value).to.exist
        .and.be.instanceof(Error)
        .and.have.property('message', 'test error')
    }).always(done)
  })

  it("should produce desired result .always() expect equal false", function(done){
    example(false).always(function(value){
      expect(value).to.equal(false)
    }).always(done)
  })

})
