module.exports = function (file) {
  return {
    buildLinks: [
      ['api/' + file.name + '.md', 'API.md']
    ]
  }
}
