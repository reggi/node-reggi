/* turn the contents of array or object into sorted string */
function assimilate (item) {
  if (typeof item === 'undefined') return false
  return JSON.stringify(item).split('').sort().join('')
}

module.exports = assimilate
