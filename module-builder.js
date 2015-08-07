var debug = require('debug')('npm-build-module')
var R = require('ramda')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var fse = Promise.promisifyAll(require('fs-extra'))
var packageDeps = require('./package-deps')

function debugCatch (e) {
  debug(e.message)
  return false
}

function debugThen () {
  var args = Array.prototype.slice.call(arguments)
  return function (value) {
    debug.apply(null, args)
    return value
  }
}

/**
 * npm-build-module
 * @param  {string} mainFile      the javascript file to build into module
 * @param  {string} moduleName        the name of the new module
 * @param  {string} testDir     the path of the test directory
 * @param  {string} docsDir     the path of the docs directory
 * @param  {string} localDir    the path of the new local modules direcotry
 * @param  {string} packagesDir the path of the new packages direcotry
 * @param  {string} readmeName  the name for readme files
 */
module.exports = function (mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName) {
  if (!localDir) localDir = path.join('local_modules')
  if (!docsDir) docsDir = path.join('docs')
  if (!testDir) testDir = path.join('test')
  if (!packagesDir) packagesDir = path.join('packages')
  if (!binDir) binDir = path.join('bin')
  if (!readmeName) readmeName = 'readme.md'
  return Promise.resolve()
  .then(function () {
    if (!mainFile) throw new Error('need main file to build module')
    var pkg = {}
    pkg.main = mainFile
    pkg.name = (moduleName) ? moduleName : path.basename(mainFile, path.extname(mainFile))
    var paths = {}
    paths.nodeModulesDir = path.join('node_modules')
    paths.nodeModulesDirDst = path.join(paths.nodeModulesDir, pkg.name)
    paths.localModulesDir = path.join(localDir)
    paths.localModulesDirDst = path.join(paths.localModulesDir, pkg.name)
    paths.test = path.join(testDir, pkg.main)
    paths.testDst = path.join(paths.localModulesDirDst, testDir, pkg.main)
    paths.readme = path.join(docsDir, pkg.name + '.md')
    paths.readmeDst = path.join(paths.localModulesDirDst, 'readme.md')
    paths.bin = path.join(binDir, pkg.main)
    paths.binDst = path.join(paths.localModulesDirDst, 'bin', pkg.main)
    paths.packageBackup = path.join(packagesDir, 'package-' + pkg.name + '.json')
    paths.package = path.join('package.json')
    paths.packageDst = path.join(paths.localModulesDirDst, 'package.json')
    paths.mainDst = path.join(paths.localModulesDirDst, pkg.main)
    return Promise.props({
      // link mainfile
      'linkMainfile': fse.ensureLinkAsync(pkg.main, paths.mainDst)
      .then(debugThen('linking main %s -> %s', pkg.main, paths.mainDst)).catch(debugCatch),
      // link test if exists
      'linkTest': fse.ensureLinkAsync(paths.test, paths.testDst)
      .then(debugThen('linking test %s -> %s', paths.test, paths.testDst)).catch(debugCatch),
      // link readme if exists
      'linkReadme': fse.ensureLinkAsync(paths.readme, paths.readmeDst)
      .then(debugThen('linking readme %s -> %s', paths.readme, paths.readmeDst)).catch(debugCatch),
      'linkBin': fse.ensureLinkAsync(paths.bin, paths.binDst)
      .then(debugThen('linking bin %s -> %s', paths.bin, paths.binDst)).catch(debugCatch),
      // check test
      'testExists': fs.lstatAsync(paths.test).then(R.T, R.F),
      'binExists': fs.lstatAsync(paths.bin).then(R.T, R.F)
    }).then(function (data) {
      // get package deps
      paths.test = (data.testExists) ? paths.test : false
      return packageDeps(pkg.main, paths.test, paths.package).then(function (pkgDeps) {
        pkg.devDependencies = pkgDeps.devDependencies
        pkg.dependencies = pkgDeps.dependencies
        if (data.binExists) pkg.bin = path.join('bin', pkg.main)
        pkgDeps.testDeps.local = (pkgDeps.testDeps.local) ? pkgDeps.testDeps.local : []
        pkgDeps.mainDeps.local = (pkgDeps.mainDeps.local) ? pkgDeps.mainDeps.local : []
        return Promise.props({
          // symlink new local module to node modules
          'symlinkModule': fse.ensureSymlinkAsync(paths.localModulesDirDst, paths.nodeModulesDirDst)
          .then(debugThen('symlinking module %s -> %s', paths.localModulesDirDst, paths.nodeModulesDirDst)).catch(debugCatch),
          // write the new package.json file
          'writePkg': fs.lstatAsync(paths.packageDst).then(R.T, R.F).then(function (exists) {
            if (exists) {
              return fse.readJsonAsync(paths.packageDst).then(function (existingPkg) {
                existingPkg.devDependencies = pkgDeps.devDependencies
                existingPkg.dependencies = pkgDeps.dependencies
                return fse.writeJsonAsync(paths.packageDst, existingPkg)
              }).then(debugThen('updating package deps %s', paths.packageDst)).catch(debugCatch)
            } else {
              return fs.lstatAsync(paths.packageBackup).then(R.T, R.F).then(function (exists) {
                if (exists) {
                  return fse.readJsonAsync(paths.packageBackup).then(function (existingPkg) {
                    existingPkg.devDependencies = pkgDeps.devDependencies
                    existingPkg.dependencies = pkgDeps.dependencies
                    return fse.writeJsonAsync(paths.packageDst, existingPkg)
                  }).then(debugThen('updating package from backup %s', paths.packageBackup)).catch(debugCatch)
                } else {
                  return fse.writeJsonAsync(paths.packageDst, pkg)
                  .then(debugThen('writing package %s', paths.packageDst)).catch(debugCatch)
                }
              })
            }
          }).then(function () {
            return fse.ensureLinkAsync(paths.packageDst, paths.packageBackup)
            .then(debugThen('writing package backup %s', paths.packageDst, paths.packageBackup)).catch(debugCatch)
          }),
          // map over local dependencies
          'localDeps': Promise.map(pkgDeps.mainDeps.local, function (dep) {
            var srcpath = pkg.main
            var srcext = path.extname(srcpath)
            var depext = path.extname(dep)
            if (depext === '') dep = dep + srcext
            var deppath = path.join(srcpath, '..', dep)
            var dstDep = path.join(paths.localModulesDirDst, deppath)
            return fse.ensureLinkAsync(dep, dstDep)
            .then(debugThen('linking local dep %s -> %s', dep, dstDep)).catch(debugCatch)
          }).then(function (data) {
            // map over local dev dependencies
            return Promise.map(pkgDeps.testDeps.local, function (dep) {
              var srcpath = pkg.main
              var srcext = path.extname(srcpath)
              var depext = path.extname(dep)
              if (depext === '') dep = dep + srcext
              var deppath = path.join(testDir, dep)
              var dstDep = path.join(paths.localModulesDirDst, deppath)
              return fse.ensureLinkAsync(deppath, dstDep)
              .then(debugThen('linking local dev dep %s -> %s', deppath, dstDep)).catch(debugCatch)
            })
          })
        })
      })
    })
  }).then(debugThen('done'))
}
