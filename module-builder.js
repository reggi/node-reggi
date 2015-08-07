var dotty = require('dotty')
var debug = require('debug')('module-builder')
var _ = require('lodash')
var R = require('ramda')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var packageDeps = require('./package-deps')

function moduleBuilder (mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName, packageFile) {

  var paths = {}
  paths.main = path.join(mainFile)
  paths.name = (moduleName) ? path.join(moduleName) : path.join(path.basename(mainFile, path.extname(mainFile)))
  paths.testDir = (testDir) ? testDir : path.join('test')
  paths.docsDir = (docsDir) ? docsDir : path.join('docs')
  paths.localModulesDir = (localDir) ? localDir : path.join('local_modules')
  paths.packagesDir = (packagesDir) ? packagesDir : path.join('packages')
  paths.binDir = (binDir) ? binDir : path.join('bin')
  paths.package = (packageFile) ? path.join(packageFile) : path.join('package.json')
  paths.readmeName = (readmeName) ? readmeName : path.join('readme.md')
  paths.nodeModulesDir = path.join('node_modules')
  paths.nodeModulesDirDst = path.join(paths.nodeModulesDir, paths.name)
  paths.localModulesDirDst = path.join(paths.localModulesDir, paths.name)
  paths.readme = path.join(paths.docsDir, paths.name + '.md')
  paths.bin = path.join(paths.binDir, paths.main)
  paths.packageBackup = path.join(paths.packagesDir, 'package-' + paths.name + '.json')
  paths.packageDst = path.join(paths.localModulesDirDst, 'package.json')

  // var symlinks = []
  return packageDeps(paths.main, paths.package)
  .then(function (results) {
    return Promise.props({
      'readmeExists': fs.lstatAsync(paths.readme).then(R.T, R.F),
      'binExists': fs.lstatAsync(paths.bin).then(R.T, R.F)
    }).then(function (props) {
      return _.extend(results, props)
    })
  })
  .then(function (results) {
    var links = []
    links.push(results.testFiles)
    links.push(results.deps.local)
    links.push(results.deps.root)
    if (results.readmeExists) links.push(paths.readme)
    if (results.binExists) links.push(paths.bin)
    results.links = _.flattenDeep([links])
    return results
  })
  .then(function (results) {
    var modulePackage = {}
    modulePackage.name = paths.name
    modulePackage.main = paths.main
    if (results.binExists) modulePackage.bin = paths.bin
    if (results.testFiles.length && dotty.exists(results, 'package.scripts.test')) dotty.put(modulePackage, 'scripts.test', results.package.scripts.test)
    if (results.package.author) modulePackage.author = results.package.author
    modulePackage.dependencies = results.pkgDeps.dependencies
    modulePackage.devDependencies = results.pkgDeps.devDependencies
    results.modulePackage = modulePackage
    return results
  })
  .then(function (results) {
    return Promise.props({
      'links': moduleBuilder.makeLinks(results.links, paths.localModulesDirDst),
      'package': moduleBuilder.writePackage(paths.packageDst, paths.packageBackup, results.modulePackage),
      'symlinkModule': fs.ensureSymlinkAsync(paths.localModulesDirDst, paths.nodeModulesDirDst)
        .then(moduleBuilder.debugMsg('symlinked module %s -> %s', paths.localModulesDirDst, paths.nodeModulesDirDst))
        .catch(moduleBuilder.debugCatch)
    })
  })
}

moduleBuilder.writePackage = function (packageDst, packageBackup, modulePackage) {
  return Promise.props({
    'backup': fs.readJsonAsync(packageBackup).catch(R.F),
    'destination': fs.readJsonAsync(packageDst).catch(R.F)
  }).then(function (pkg) {
    if (!pkg.destination) {
      return fs.writeJsonAsync(packageDst, modulePackage)
      .then(moduleBuilder.debugMsg('package written'))
      .catch(moduleBuilder.debugCatch)
    } else if (pkg.destination) {
      var updatedPackage = _.cloneDeep(pkg.destination)
      _.extend(updatedPackage, modulePackage)
      return fs.writeJsonAsync(packageDst, updatedPackage)
      .then(moduleBuilder.debugMsg('package destination updated'))
      .catch(moduleBuilder.debugCatch)
    } else if (pkg.backup) {
      var updatedPackageFromBackup = _.cloneDeep(pkg.backup)
      _.extend(updatedPackageFromBackup, modulePackage)
      return fs.writeJsonAsync(packageDst, updatedPackageFromBackup)
      .then(moduleBuilder.debugMsg('package restored and updated from backup'))
      .catch(moduleBuilder.debugCatch)
    } else {
      return fs.writeJsonAsync(packageDst, modulePackage)
      .then(moduleBuilder.debugMsg('package restored and updated from backup'))
      .catch(moduleBuilder.debugCatch)
    }
  })
  .then(function () {
    return fs.ensureLinkAsync(packageDst, packageBackup)
    .then(moduleBuilder.debugMsg('package backedup'))
    .catch(moduleBuilder.debugCatch)
  })
}

moduleBuilder.makeLinks = function (links, localModuleDirDst) {
  links = _.flattenDeep([links])
  return Promise.map(links, function (link) {
    var dstpath = path.join(localModuleDirDst, link)
    return fs.ensureLinkAsync(link, dstpath)
    .then(moduleBuilder.debugMsg('link ensured %s -> %s', link, dstpath))
    .catch(moduleBuilder.debugCatch)
  })
}

moduleBuilder.debugMsg = function () {
  var args = Array.prototype.slice.call(arguments)
  return function (value) {
    debug.apply(null, args)
    return value
  }
}

moduleBuilder.debugCatch = function (e) {
  debug(e.message)
  return false
}

module.exports = moduleBuilder

//
// var recursiveDeps = require("./recursive-deps")
//
// function moduleBuilder (file) {
//   return recursiveDeps.mapRelativePaths(file)
//   .then(function(deps){
//     var deps.local
//     return recursiveDeps.mapRelativePaths()
//     .then(function(deps){
//
//     })
//   })
// }
//
//
//
// /**
//  * npm-build-module
//  * @param  {string} mainFile      The javascript file to build into module
//  * @param  {string} moduleName    The name of the new module
//  * @param  {string} testDir       The path of the test directory
//  * @param  {string} docsDir       The path of the docs directory
//  * @param  {string} localDir      The path of the new local modules direcotry
//  * @param  {string} packagesDir   The path of the new packages direcotry
//  * @param  {string} readmeName    The name for readme files
//  */
// module.exports = function (mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName) {

//   return Promise.resolve()
//   .then(function () {
//     if (!mainFile) throw new Error('need main file to build module')
//     var pkg = {}
//     pkg.main = mainFile
//     pkg.name = (moduleName) ? moduleName : path.basename(mainFile, path.extname(mainFile))
//     var paths = {}
//     paths.nodeModulesDir = path.join('node_modules')
//     paths.nodeModulesDirDst = path.join(paths.nodeModulesDir, pkg.name)
//     paths.localModulesDir = path.join(localDir)
//     paths.localModulesDirDst = path.join(paths.localModulesDir, pkg.name)
//     paths.test = path.join(testDir, pkg.main)
//     paths.testDst = path.join(paths.localModulesDirDst, testDir, pkg.main)
//     paths.readme = path.join(docsDir, pkg.name + '.md')
//     paths.readmeDst = path.join(paths.localModulesDirDst, 'readme.md')
//     paths.bin = path.join(binDir, pkg.main)
//     paths.binDst = path.join(paths.localModulesDirDst, 'bin', pkg.main)
//     paths.packageBackup = path.join(packagesDir, 'package-' + pkg.name + '.json')
//     paths.package = path.join('package.json')
//     paths.packageDst = path.join(paths.localModulesDirDst, 'package.json')
//     paths.mainDst = path.join(paths.localModulesDirDst, pkg.main)
//
//     // var link = []
//     // var symlink = []
//     // link main file
//     // symlink.push(pkg.main, paths.mainDst)
//     // symlink.push(paths.test, paths.testDst)
//
//     return Promise.props({
//       // link mainfile
//       'linkMainfile': fse.ensureLinkAsync(pkg.main, paths.mainDst)
//       .then(debugThen('linking main %s -> %s', pkg.main, paths.mainDst)).catch(debugCatch),
//       // link test if exists
//       'linkTest': fse.ensureLinkAsync(paths.test, paths.testDst)
//       .then(debugThen('linking test %s -> %s', paths.test, paths.testDst)).catch(debugCatch),
//       // link readme if exists
//       'linkReadme': fse.ensureLinkAsync(paths.readme, paths.readmeDst)
//       .then(debugThen('linking readme %s -> %s', paths.readme, paths.readmeDst)).catch(debugCatch),
//       'linkBin': fse.ensureLinkAsync(paths.bin, paths.binDst)
//       .then(debugThen('linking bin %s -> %s', paths.bin, paths.binDst)).catch(debugCatch),
//       // check test
//       'testExists': fs.lstatAsync(paths.test).then(R.T, R.F),
//       'binExists': fs.lstatAsync(paths.bin).then(R.T, R.F)
//     }).then(function (data) {
//       // get package deps
//       paths.test = (data.testExists) ? paths.test : false
//       return packageDeps(pkg.main, paths.test, paths.package).then(function (pkgDeps) {
//         // console.log(pkgDeps)
//         pkg.devDependencies = pkgDeps.devDependencies
//         pkg.dependencies = pkgDeps.dependencies
//         if (data.binExists) pkg.bin = path.join('bin', pkg.main)
//         pkgDeps.testDeps.local = (pkgDeps.testDeps.local) ? pkgDeps.testDeps.local : []
//         pkgDeps.mainDeps.local = (pkgDeps.mainDeps.local) ? pkgDeps.mainDeps.local : []
//         return Promise.props({
//           // symlink new local module to node modules
//           'symlinkModule': fse.ensureSymlinkAsync(paths.localModulesDirDst, paths.nodeModulesDirDst)
//           .then(debugThen('symlinking module %s -> %s', paths.localModulesDirDst, paths.nodeModulesDirDst)).catch(debugCatch),
//           // write the new package.json file
//           'writePkg': fs.lstatAsync(paths.packageDst).then(R.T, R.F).then(function (exists) {
//             if (exists) {
//               return fse.readJsonAsync(paths.packageDst).then(function (existingPkg) {
//                 existingPkg.devDependencies = pkgDeps.devDependencies
//                 existingPkg.dependencies = pkgDeps.dependencies
//                 return fse.writeJsonAsync(paths.packageDst, existingPkg)
//               }).then(debugThen('updating package deps %s', paths.packageDst)).catch(debugCatch)
//             } else {
//               return fs.lstatAsync(paths.packageBackup).then(R.T, R.F).then(function (exists) {
//                 if (exists) {
//                   return fse.readJsonAsync(paths.packageBackup).then(function (existingPkg) {
//                     existingPkg.devDependencies = pkgDeps.devDependencies
//                     existingPkg.dependencies = pkgDeps.dependencies
//                     return fse.writeJsonAsync(paths.packageDst, existingPkg)
//                   }).then(debugThen('updating package from backup %s', paths.packageBackup)).catch(debugCatch)
//                 } else {
//                   return fse.writeJsonAsync(paths.packageDst, pkg)
//                   .then(debugThen('writing package %s', paths.packageDst)).catch(debugCatch)
//                 }
//               })
//             }
//           }).then(function () {
//             return fse.ensureLinkAsync(paths.packageDst, paths.packageBackup)
//             .then(debugThen('writing package backup %s', paths.packageDst, paths.packageBackup)).catch(debugCatch)
//           }),
//           // map over local dependencies
//           'localDeps': Promise.map(pkgDeps.mainDeps.local, function (dep) {
//             var srcpath = pkg.main
//             var srcext = path.extname(srcpath)
//             var depext = path.extname(dep)
//             if (depext === '') dep = dep + srcext
//             var deppath = path.join(srcpath, '..', dep)
//             var dstDep = path.join(paths.localModulesDirDst, deppath)
//             return fse.ensureLinkAsync(dep, dstDep)
//             .then(debugThen('linking local dep %s -> %s', dep, dstDep)).catch(debugCatch)
//           }).then(function (data) {
//             // map over local dev dependencies
//             return Promise.map(pkgDeps.testDeps.local, function (dep) {
//               var srcpath = pkg.main
//               var srcext = path.extname(srcpath)
//               var depext = path.extname(dep)
//               if (depext === '') dep = dep + srcext
//               var deppath = path.join(testDir, dep)
//               var dstDep = path.join(paths.localModulesDirDst, deppath)
//               return fse.ensureLinkAsync(deppath, dstDep)
//               .then(debugThen('linking local dev dep %s -> %s', deppath, dstDep)).catch(debugCatch)
//             })
//           })
//         })
//       })
//     })
//   }).then(debugThen('done'))
// }
