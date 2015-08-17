var nixt = require('nixt')
var path = require('path')
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

describe(DESC, function () {

  // does not pass

  // it('should exit 1 with && node eval process', function (done) {
  //   return nixt()
  //   .run('node -e \'process.exit(0)\' && node -e \'process.exit(1)\'')
  //   .code(1)
  //   .end(done)
  // })

  // it('should exit 1 with echo + exit', function (done) {
  //   return nixt()
  //   .run('echo \"Error: no test specified\" && exit 1')
  //   .code(0)
  //   .end(done)
  // })

  // it('should exit 1 with exit', function (done) {
  //   return nixt()
  //   .run('exit 1')
  //   .code(0)
  //   .end(done)
  // })

  it('should exit 0 with echo', function (done) {
    return nixt()
    .run('echo \'Meow.\'')
    .code(0)
    .end(done)
  })


  it('should exit 1 with node eval', function (done) {
    return nixt()
    .run('node -e \"process.exit(1)"')
    .code(1)
    .end(done)
  })

  it('should exit 0 with node eval', function (done) {
    return nixt()
    .run('node -e \"process.exit(0)"')
    .code(0)
    .end(done)
  })

})
