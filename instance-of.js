
/** returns true if value is instance of object or string name */
function instanceOf (val, obj) {
  if (typeof obj === 'string') {
    obj = obj.toLowerCase()
    if (val === null && obj === 'null') return true
    if (val === undefined && obj === 'undefined') return true
    return Object(val).constructor.name.toLowerCase() === obj
  } else {
    if (val === null && obj === null) return true
    if (val === undefined && obj === undefined) return true
    return Object(val).constructor === obj
  }
}

module.exports = instanceOf
