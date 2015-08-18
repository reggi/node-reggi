
function willReturnPromise(fn) {
  try{
    fn();
    return result && typeof result.then === 'function';
  }catch(e){
    return false
  }
}

function willReturnPromise(fn){
  var value = fn.apply(null, null)
  if(value.then) return true
  return false
}

var myPromiseFunction = function(){
  return Promise.resolve(true)
}

function mySyncFunction(){
  return "hello"
}

console.log(willReturnPromise(myPromiseFunction)) // => true
console.log(willReturnPromise(mySyncFunction)) // => false
