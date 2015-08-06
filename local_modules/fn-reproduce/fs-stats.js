/**
 * Given stats from fs.lstat or fs.stat will return type
 * @param  {Object} stats
 * @return {String}
 */
function fsStats (stats) {
  if (stats.isFile && stats.isFile()) return 'file'
  if (stats.isDirectory && stats.isDirectory()) return 'directory'
  if (stats.isBlockDevice && stats.isBlockDevice()) return 'blockedDevice'
  if (stats.isCharacterDevice && stats.isCharacterDevice()) return 'characterDevice'
  if (stats.isSymbolicLink && stats.isSymbolicLink()) return 'symbolicLink'
  if (stats.isFIFO && stats.isFIFO()) return 'FIFO'
  if (stats.isSocket && stats.isSocket()) return 'socket'
  return 'unknownType'
}

module.exports = fsStats
