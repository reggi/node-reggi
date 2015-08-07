module.exports = function (str, err, callback) {
  callback = (typeof err === 'function') ? err : callback
  err = (typeof err === 'function') ? null : err
  return callback(err, str)
}
