module.exports = function(fn){
  return this
    .catch(function(e){
      return e
    })
    .then(fn)
}
