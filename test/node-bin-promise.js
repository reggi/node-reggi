var Promise = require('bluebird')
module.exports = function (str, err) {
  if (err) {
    return Promise.resolve().then(function () {
      throw err
    })
  }else{
    return Promise.resolve(str)
  }
}
