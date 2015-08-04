var R = require('ramda')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var fse = Promise.promisifyAll(require('fs-extra'))
var packageDeps = require('./package-deps')

function existsEnsure (srcpath, dstpath) {
  return fs.lstatAsync(srcpath).then(R.T, R.F).then(function (exists) {
    if (exists) fse.ensureLinkAsync(srcpath, dstpath)
    return false
  })
}

/**
 * @param  {String} jsFile - Path to main file.
 * @param  {String} [name] - Name of module.
 */
module.exports = function (jsFile, name, testDir, docsDir, localDir, readmeName) {
  if (!localDir) localDir = path.join('local_modules')
  if (!docsDir) docsDir = path.join('docs')
  if (!testDir) testDir = path.join('test')
  if (!readmeName) readmeName = 'readme.md'
  return Promise.resolve()
  .then(function () {
    if (!jsFile) throw new Error('need main file to build module')
    var pkg = {}
    pkg.main = jsFile
    pkg.name = (name) ? name : path.basename(jsFile, path.extname(jsFile))
    var paths = {}
    paths.nodeModulesDir = path.join('node_modules')
    paths.nodeModulesDirDst = path.join(paths.nodeModulesDir, pkg.name)
    paths.localModulesDir = path.join(localDir)
    paths.localModulesDirDst = path.join(paths.localModulesDir, pkg.name)
    paths.test = path.join(testDir, pkg.main)
    paths.testDst = path.join(paths.localModulesDirDst, testDir, pkg.main)
    paths.readme = path.join(docsDir, pkg.name + '.md')
    paths.readmeDst = path.join(paths.localModulesDirDst, 'readme.md')
    paths.package = path.join('package.json')
    paths.packageDst = path.join(paths.localModulesDirDst, 'package.json')
    paths.mainDst = path.join(paths.localModulesDirDst, pkg.main)
    return Promise.props({
      // link mainfile
      'linkMainfile': fse.ensureLinkAsync(pkg.main, paths.mainDst),
      // link test if exists
      'linkTest': existsEnsure(paths.test, paths.testDst),
      // link readme if exists
      'linkReadme': existsEnsure(paths.readme, paths.readmeDst),
      // check test
      'testExists': fs.lstatAsync(paths.test).then(R.T, R.F)
    }).then(function (data) {
      // get package deps
      paths.test = (data.testExists) ? paths.test : false
      return packageDeps(pkg.main, paths.test, paths.package).then(function (pkgDeps) {
        pkg.devDependencies = pkgDeps.devDependencies
        pkg.dependencies = pkgDeps.dependencies
        pkgDeps.testDeps.local = (pkgDeps.testDeps.local) ? pkgDeps.testDeps.local : []
        pkgDeps.mainDeps.local = (pkgDeps.mainDeps.local) ? pkgDeps.mainDeps.local : []
        return Promise.all([
          // symlink new local module to node modules
          fse.ensureSymlinkAsync(paths.localModulesDirDst, paths.nodeModulesDirDst),
          // write the new package.json file
          fse.writeJSONAsync(paths.packageDst, pkg),
          // map over local dependencies
          Promise.map(pkgDeps.mainDeps.local, function (dep) {
            var srcpath = pkg.main
            var srcext = path.extname(srcpath)
            var depext = path.extname(dep)
            if (depext === '') dep = dep + srcext
            var deppath = path.join(srcpath, '..', dep)
            var dstDep = path.join(paths.localModulesDirDst, deppath)
            return fse.ensureLinkAsync(dep, dstDep)
          }),
          // map over local dev dependencies
          Promise.map(pkgDeps.testDeps.local, function (dep) {
            var srcpath = pkg.main
            var srcext = path.extname(srcpath)
            var depext = path.extname(dep)
            if (depext === '') dep = dep + srcext
            var deppath = path.join(testDir, dep)
            var dstDep = path.join(paths.localModulesDirDst, deppath)
            return fse.ensureLinkAsync(deppath, dstDep)
          })
        ])
      })
    })
  })
}
