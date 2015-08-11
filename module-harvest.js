var _ = require('lodash')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var dotty = require('dotty')
var debug = require('debug')('module-harvest')
var promiseTransformStream = require('./promise-transform-stream')
var jsdocParse = require('jsdoc-parse')
var jsdocParseAsync = promiseTransformStream(jsdocParse)
var recursiveDeps = require('./recursive-deps')
var sortedObject = require('sorted-object')
var packageOrder = require('./package-order')
var R = require('ramda')
var _eval = require('eval')
var promisePropsSeries = require('./promise-props-series')
// var githubCreateRepo = require('./github-create-repo')
// var git = require('simple-git')

/**
 * :corn: Build a module from a single javascript file.
 * @module module-harvest
 * @package.keywords dependency, dependencies, build, package.json, harvest, module
 * @package.preferGlobal
 * @package.repository.type git
 * @package.repository.url https://github.com/reggi/node-module-harvest
 */

/** Tracks down package dependencies, and local, main, and bin files. */
function moduleHarvest () {
  var args = arguments
  var options = _.zipObject(_.keys(moduleHarvest.defaultArgs), _.values(args))
  _.defaults(options, moduleHarvest.defaultArgs)
  options.file = path.parse(path.join(options.moduleFile))
  options.file.format = path.format(options.file)
  return fs.readFileAsync(options.file.format, 'utf8').then(jsdocParseAsync)
  .then(function (jsdoc) {
    options.moduleDef = _.findWhere(jsdoc, {'kind': 'module'}) || {}
    options.package = moduleHarvest.jsdocPackage(options.moduleDef)
    options.package.name = options.moduleName || options.moduleDef.name || options.file.name
    options.description = options.moduleDesc || options.moduleDef.summary || options.moduleDef.description || false
    options.github = {}
    options.github.repo = (options.githubRepoPrefix) ? options.githubRepoPrefix + options.package.name : options.package.name
    options.package.main = options.file.format
    options.package.version = (options.package.version) ? options.package.version : options.moduleVersion
    if (options.description) options.github.description = options.description
    if (options.description) options.package.description = moduleHarvest.removeEmoji(options.description)
    options = (options.preventMerge) ? options : moduleHarvest.argMerge(options, moduleHarvest.defaultArgData(options.file))
    options.localModulesDirName = path.join(options.localModulesDirName)
    options.localModuleDst = path.join(options.localModulesDirName, options.package.name)
    options.localModuleGit = path.join(options.localModuleDst, '.git')
    options.nodeModulesDst = path.join('node_modules', options.package.name)
    options.packageSrc = path.join(options.packageSrc)
    options.packageDst = path.join(options.localModuleDst, 'package.json')
    options.trackDeps = moduleHarvest.ensureLinkArgs(options.trackDeps)
    options.trackDeps = moduleHarvest.prefaceLinkArgs(options.trackDeps, options.directory, options.localModuleDst)
    options.trackDeps = moduleHarvest.objLinkArgs(options.trackDeps)
    options.postBuildReverseLinks = moduleHarvest.prefaceLinkArgs(options.postBuildReverseLinks, options.localModuleDst, options.directory) // note reversed
    options.postBuildReverseLinks = moduleHarvest.ensureLinkArgs(options.postBuildReverseLinks)
    options.postBuildReverseLinks = moduleHarvest.objLinkArgs(options.postBuildReverseLinks)
    options.buildLinks = moduleHarvest.ensureLinkArgs(options.buildLinks)
    options.buildLinks = moduleHarvest.prefaceLinkArgs(options.buildLinks, options.directory, options.localModuleDst)
    options.buildLinks = moduleHarvest.objLinkArgs(options.buildLinks)
    return Promise.props({
      'moduleGitExists': fs.lstatAsync(options.localModuleGit).then(R.T, R.F),
      'moduleExists': fs.lstatAsync(options.localModuleDst).then(R.T, R.F),
      'deps': moduleHarvest.deps(_.pluck(options.trackDeps, 'src'), options.trackDevDeps),
      'package': fs.readJsonAsync(options.packageSrc),
      'bin': moduleHarvest.existingFiles(_.pluck(options.trackDeps, 'src'))
        .then(moduleHarvest.detectBin)
        .then(moduleHarvest.packageBin)
    }).then(function (results) {
      options.moduleExists = results.moduleExists
      options.deps = results.deps.deps
      options.devDeps = results.deps.devDeps
      var packacageSrcContent = results.package
      var bin = results.bin
      options.localDeps = _.chain([options.deps.local, options.deps.root, options.devDeps.local, options.devDeps.root]).flattenDeep().unique().value()
      options.localDeps = moduleHarvest.ensureLinkArgs(options.localDeps)
      options.localDeps = moduleHarvest.prefaceLinkArgs(options.localDeps, options.directory, options.localModuleDst)
      options.localDeps = moduleHarvest.objLinkArgs(options.localDeps)
      options.buildLinks = _.flatten([options.buildLinks, options.localDeps])
      if (packacageSrcContent.author) options.package.author = packacageSrcContent.author
      if (!dotty.exists(options, 'package.scripts.test') && dotty.exists(packacageSrcContent, 'scripts.test') && options.devDeps.local.length) dotty.put(packacageSrcContent, 'scripts.test', options.package)
      if (!dotty.exists(options, 'package.licence') && dotty.exists(packacageSrcContent, 'licence')) options.package.license = packacageSrcContent.license
      options.designatedDeps = moduleHarvest.designateDeps(options.deps.npm, options.devDeps.npm, packacageSrcContent)
      _.extend(options.package, options.designatedDeps)
      if (bin) options.package.bin = bin
      options.package = packageOrder(options.package, moduleHarvest.packageOrder)
      return options
    })
  })
  .then(function (options) {
    return promisePropsSeries({
      'buildLinks': function () {
        // console.log(options.buildLinks)
        return moduleHarvest.buildLinks(options.buildLinks)
      },
      'ensurePackage': function () {
        return moduleHarvest.writePackage(options.packageDst, options.package)
      },
      'postBuildReverseLinks': function () {
        return moduleHarvest.buildLinks(options.postBuildReverseLinks)
      },
      'symlinks': function () {
        return fs.ensureSymlinkAsync(options.localModuleDst, options.nodeModulesDst)
          .then(moduleHarvest.debugMsg('symlinked module %s -> %s', options.localModuleDst, options.nodeModulesDst))
          .catch(moduleHarvest.debugCatch)
      }
      // 'github': function () {
      //   if (options.moduleGitExists) return false
      //   if (options.package.private) return false
      //   if (!options.githubAccessToken) return false
      //   console.log("would post")
      //   return githubCreateRepo(options.githubAccessToken, options.github.repo, options.github.description)
      //   .then(function (repo) {
      //     var url = repo[0].clone_url
      //     debug('github repo created %s', url)
      //     return git(options.localModulesDst)
      //     .init()
      //     .add('./*')
      //     .commit('init')
      //     .addRemote('origin', url)
      //     .push('origin', 'master')
      //     .then(function () {
      //       return repo
      //     })
      //   })
      // }
    })
  })
}

/** object of arguments and default values*/
moduleHarvest.defaultArgs = {
  'moduleFile': undefined,
  'moduleName': undefined,
  'moduleDesc': undefined,
  'moduleVersion': '0.0.1',
  'packageSrc': './package.json',
  'localModulesDirName': './local_modules',
  'directory': './',
  'buildLinks': [],
  'trackDeps': [],
  'trackDevDeps': undefined,
  'postBuildReverseLinks': [],
  'githubAccessToken': undefined,
  'githubRepoPrefix': undefined,
  'preventMerge': undefined
}

/** acceptable config files */
moduleHarvest.configFiles = [
  'harvest.config.js',
  'harvest.secret.js',
  'harvest.config.json',
  'harvest.secret.json'
]

moduleHarvest.configFileArgs = function (options) {
  if (!options) options = {}
  return moduleHarvest.existingFiles(moduleHarvest.configFiles)
  .map(function (existingConfigFile) {
    var type = path.extname(existingConfigFile)
    return fs.readFileAsync(existingConfigFile, 'utf8')
    .then(function (content) {
      if (type === '.js') {
        var mod = _eval(content)
        if (typeof mod === 'function') return mod(options)
        return mod
      }
      if (type === '.json') return JSON.parse(content)
    })
  })
  .then(function (files) {
    return _.extend.apply(null, files) || {}
  })
}

/** default set of arguments totally overwritable or appendable */
moduleHarvest.defaultArgData = function (file) {
  return {
    'buildLinks': [
      // src (CWD), destination (./local_modules/<my-module>/)
      ['CONTRIBUTING'],
      ['LICENCE'],
      // ['gitignore/' + '.' + file.name, '.gitignore'],
      // ['gitignore/' + '.' + file.name + '.gitignore', '.gitignore'],
      // ['gitignore/' + file.name, '.gitignore'],
      // ['gitignore/' + file.name + '.gitignore', '.gitignore'],
      // ['gitignore/' + '.gitignore-' + file.name, '.gitignore'],
      // ['gitignore/' +'.gitignore.' + file.name, '.gitignore'],
      ['.gitignore-harvest', '.gitignore'],
      ['.npmignore-harvest', '.npmignore'],
      ['docs/' + file.name + '.md', 'README.md'],
      ['docs/general.md', 'README.md'],
      // ['ci/.travis-' + file.name + '.yml', '.travis.yml'], // use specific if exists
      ['.travis.yml'], // backup if specific doesn't exist
      ['packages/package-' + file.name + '.json', 'package.json']
    ],
    'trackDeps': [
      // javascript files can't change name
      file.format,
      path.join('bin', file.format)
    ],
    'trackDevDeps': function (file) {
      // this is a function because devDeps are tracked for
      // each `trackDeps` and all other `required` local modules
      // all possible conventions for test
      return [
        path.join('test', file.format),
        path.join('test', file.format)
        // path.join('test', file.base),
        // path.join('test', 'test' + file.base),
        // path.join('test', 'test.' + file.base),
        // path.join('test', 'test-' + file.base),
        // path.join('test', 'test_' + file.base),
        // path.join('test', file.name + '.test' + file.ext),
        // path.join('test', file.name + '-test' + file.ext),
        // path.join('test', file.name + '_test' + file.ext),
        // path.join('test', file.dir, 'test' + file.base),
        // path.join('test', file.dir, 'test.' + file.base),
        // path.join('test', file.dir, 'test-' + file.base),
        // path.join('test', file.dir, 'test_' + file.base),
        // path.join('test', file.dir, file.name + 'test' + file.ext),
        // path.join('test', file.dir, file.name + '.test' + file.ext),
        // path.join('test', file.dir, file.name + '-test' + file.ext),
        // path.join('test', file.dir, file.name + '_test' + file.ext),
        // path.join('tests', file.format),
        // path.join('tests', file.base),
        // path.join('tests', 'test' + file.base),
        // path.join('tests', 'test.' + file.base),
        // path.join('tests', 'test-' + file.base),
        // path.join('tests', 'test_' + file.base),
        // path.join('tests', file.name + '.test' + file.ext),
        // path.join('tests', file.name + '-test' + file.ext),
        // path.join('tests', file.name + '_test' + file.ext),
        // path.join('tests', file.dir, 'test' + file.base),
        // path.join('tests', file.dir, 'test.' + file.base),
        // path.join('tests', file.dir, 'test-' + file.base),
        // path.join('tests', file.dir, 'test_' + file.base),
        // path.join('tests', file.dir, file.name + 'test' + file.ext),
        // path.join('tests', file.dir, file.name + '.test' + file.ext),
        // path.join('tests', file.dir, file.name + '-test' + file.ext),
        // path.join('tests', file.dir, file.name + '_test' + file.ext]
      ]
    },
    'postBuildReverseLinks': [
      // src (./local_modules/<my-module>/), destination (CWD)
      ['package.json', 'packages/package-' + file.name + '.json']
    ]
  }
}

/**
 * merge two object's arrays
 * @see {@link https://lodash.com/docs#merge}
 */
moduleHarvest.argMerge = function (object, other) {
  return _.merge(object, other, function (a, b) {
    if (_.isArray(a)) {
      return a.concat(b)
    }
  })
}

/* convert array of strings to array of array's */
moduleHarvest.ensureLinkArgs = function (links) {
  return _.map(links, function (link) {
    if (!Array.isArray(link)) return [link]
    return link
  })
}

/** prefaces hard links path arguments from array of args [src, dst] */
moduleHarvest.prefaceLinkArgs = function (links, srcDir, dstDir) {
  return _.map(links, function (link) {
    var src = path.join(srcDir, link[0])
    var dst = (link[1]) ? path.join(dstDir, link[1]) : path.join(dstDir, link[0])
    return [src, dst]
  })
}

/** convert array of [src, dst] links to object */
moduleHarvest.objLinkArgs = function (links) {
  return _.map(links, function (link) {
    return _.zipObject(['src', 'dst'], link)
  })
}

/** returns existing files from array of files */
moduleHarvest.existingFiles = function (files) {
  if (!Array.isArray(files)) files = [files]
  return Promise.map(files, function (file) {
    return fs.lstatAsync(file).then(function (stat) {
      return file
    }, function () {
      if (debug) debug('file %s does not exist', file)
      return false
    })
  }).then(_).call('without', false).call('value')
}

/** get all the possible test files */
moduleHarvest.runTrackDevDeps = function (deps, trackDevDeps) {
  return _.chain([deps.local, deps.root])
  .flatten()
  .map(function (file) {
    var _file = path.parse(file)
    _file.format = path.format(_file)
    return trackDevDeps(_file)
  })
  .flatten()
  .unique()
  .value()
}

/** get the deps for all files and test files */
moduleHarvest.deps = function (trackDepSrcFiles, trackDevDeps) {
  var results = {}
  return moduleHarvest.existingFiles(trackDepSrcFiles)
  .then(recursiveDeps.mapRelativePaths)
  .then(function (deps) {
    results.deps = deps
    var possibleTestFiles = moduleHarvest.runTrackDevDeps(deps, trackDevDeps)
    return moduleHarvest.existingFiles(possibleTestFiles)
    .then(recursiveDeps.mapRelativePaths)
    .then(function (devDeps) {
      results.devDeps = devDeps
      return results
    })
  })
}

/** removes github style emoji froms sring */
moduleHarvest.removeEmoji = function (str) {
  return str.replace(/^\:.+\:\s+/g, '')
}

/** assign versions to dependencies via given pacakge */
moduleHarvest.designateDeps = function (depsNpm, devDepsNpm, pkg) {
  var newPkg = {}

  // get the deps
  newPkg.dependencies = _.chain(depsNpm)
  .map(function (dep) {
    if (pkg.dependencies[dep]) return [dep, pkg.dependencies[dep]]
    return false
  })
  .without(false)
  .object()
  .thru(sortedObject)
  .value()
  var missingDeps = _.difference(depsNpm, _.keys(newPkg.dependencies))
  if (missingDeps.length > 1) throw new Error('missing dependencies: ' + missingDeps.join(', ') + '.')
  if (missingDeps.length === 1) throw new Error('missing dependency: ' + missingDeps.join(', ') + '.')

  // get the dev deps
  newPkg.devDependencies = _.chain(devDepsNpm)
  .filter(function (dep) {
    return !_.contains(_.keys(newPkg.dependencies), dep)
  })
  .map(function (dep) {
    if (pkg.devDependencies[dep]) return [dep, pkg.devDependencies[dep]]
    if (pkg.dependencies[dep]) return [dep, pkg.dependencies[dep]]
    return false
  })
  .without(false)
  .object()
  .thru(sortedObject)
  .value()
  var allDeps = _.flatten([_.keys(newPkg.devDependencies), _.keys(newPkg.dependencies)])
  var missingDevDeps = _.difference(devDepsNpm, allDeps)
  if (missingDevDeps.length > 1) throw new Error('missing devDependencies: ' + missingDevDeps.join(', ') + '.')
  if (missingDevDeps.length === 1) throw new Error('missing devDependency: ' + missingDevDeps.join(', ') + '.')
  if (!_.size(newPkg.devDependencies)) delete newPkg.devDependencies
  return newPkg
}

moduleHarvest.jsdocPackage = function (def) {
  if (!def) return {}
  var packageKeywords = _.map(def.customTags, function (tag) {
    if (!tag.tag.match(/^package\./)) return false
    var keyword = tag.tag.replace(/^package\./, '')
    var value = (function () {
      if (!tag.value) return true
      if (keyword === 'keywords') return tag.value.split(', ')
      try {
        return JSON.parse(tag.value)
      } catch(e) {
        return tag.value
      }
    }())
    return {
      'keyword': keyword,
      'value': value
    }
  })
  var results = {}
  _.each(packageKeywords, function (set) {
    dotty.put(results, set.keyword, set.value)
  })
  return results
}

/** debug message from promise then */
moduleHarvest.debugMsg = function () {
  var args = Array.prototype.slice.call(arguments)
  return function (value) {
    debug.apply(null, args)
    return value
  }
}

/** catch message for debug from promise catch */
moduleHarvest.debugCatch = function (e) {
  debug(e.message)
  return false
}

/** write pacakge from existing, backup, or generate fresh */
moduleHarvest.writePackage = function (dst, data) {
  return fs.readJsonAsync(dst).catch(R.F)
  .then(function (existing) {
    if (!existing) {
      return fs.writeJsonAsync(dst, data)
      .then(moduleHarvest.debugMsg('package written'))
      .catch(moduleHarvest.debugCatch)
    } else {
      _.defaults(existing, data)
      existing.dependencies = data.dependencies
      existing.devDependencies = data.devDependencies
      return fs.writeJsonAsync(dst, existing)
      .then(moduleHarvest.debugMsg('package updated'))
      .catch(moduleHarvest.debugCatch)
    }
  })
}

/** make hard links */
moduleHarvest.buildLinks = function (links) {
  return Promise.map(links, function (link) {
    return fs.ensureLinkAsync.apply(null, _.values(link))
    .then(moduleHarvest.debugMsg('link ensured %s -> %s', link[0], link[1]))
    .catch(moduleHarvest.debugCatch)
  }, {concurrency: 1})
}

/** detects if files have shebang declaration */
moduleHarvest.detectBin = function (files) {
  return Promise.map(files, function (file) {
    return fs.readFileAsync(file, 'utf8')
    .then(function (contents) {
      var shebang = '#!/usr/bin/env node'.replace(/\s/g, '')
      var firstLineNoSpaces = contents.split('\n')[0].replace(/\s/g, '')
      if (firstLineNoSpaces === shebang) return file
      return false
    })
  }).then(_).call('without', false).call('value')
}

/** readys array of bin files for package.bin */
moduleHarvest.packageBin = function (binFiles) {
  return _.chain(binFiles)
  .map(function (binFile) {
    var bin = path.parse(binFile)
    return [bin.name, binFile]
  })
  .object()
  .value()
}

module.exports = moduleHarvest

// moduleHarvest.binArgs = function (argv) {
//   var argDefaults = moduleHarvest.defaultArgs
//   var argAlias = moduleHarvest.argsAlias
//   return _.chain(argDefaults)
//   .keys()
//   .map(function (key) {
//     var keys = [key, key.toLowerCase()]
//     if (argAlias[key]) keys = _.flatten([keys, argAlias[key]])
//     var value = _.chain(keys)
//     .map(function (key) {
//       return (argv[key]) ? argv[key] : false
//     })
//     .without(false)
//     .value()
//     return (value[0]) ? value[0] : false
//   })
//   .value()
// }

// /** filters out links with exiting src*/
// moduleHarvest.getLinksWithExistingSrc = function (links) {
//   return Promise.resolve(links)
//   .then(_)
//   .call('map', function (link) {
//     return link[0]
//   })
//   .call('value')
//   .then(moduleHarvest.existingFiles)
//   .then(_)
//   .call('map', function (existingSrc, index) {
//     return [existingSrc, links[index][1]]
//   })
//   .call('filter', function (link) {
//     return link[0]
//   })
//   .call('value')
// }

// /** make module hard links */
// moduleHarvest.buildPrefacedExistingLinks = function (links, srcDir, dstDir) {
//   return Promise.method(moduleHarvest.prefaceArray)(links, srcDir, dstDir)
//   .then(moduleHarvest.getLinksWithExistingSrc)
//   .then(moduleHarvest.buildLinks)
// }

// /** better typeof returns array instead of object for [] */
// moduleHarvest.typeOf = function (val) {
//   if (val && val.constructor && val.constructor.name) {
//     return val.constructor.name.toLowerCase()
//   }
//   return typeof val
// }

// moduleHarvest.prefacePaths = function (paths, dir) {
//   return _.map(paths, function (_path) {
//     return path.join(dir, _path)
//   })
// }

// options.trackDevDeps = moduleHarvest.prefaceLinkArgs(options.directory, options.localModuleDst)
// options.trackDevDeps = moduleHarvest.objLinkArgs(options.trackDevDeps)

// /** make module hard links */
// moduleHarvest.buildPrefacedLinks = function (links, srcDir, dstDir) {
//   return Promise.method(moduleHarvest.prefaceLinkArgs)(links, srcDir, dstDir)
//   .then(moduleHarvest.buildLinks)
// }

// var paths = {}
// var file = path.parse(moduleFile)
// file.format = path.format(path.join(file))
// packageFile = path.join(packageFile)
// (append && buildLinks) ? _.extend(buildLinks, defaultArgs.buildLinks) :

// buildLinks = (buildLinks && defaultArgs.attach)
// buildLinks = (buildLinks && buildLinks.append) ? _.extend(buildLinks, defaultArgs.buildLinks)

// paths.main = path.join(moduleFile)
// paths.name = (moduleName) ? path.join(moduleName) : path.join(path.basename(moduleFile, path.extname(moduleFile)))
// paths.testDir = (testDir) ? testDir : path.join('test')
// paths.docsDir = (docsDir) ? docsDir : path.join('docs')
// paths.localModulesDir = (localDir) ? localDir : path.join('local_modules')
// paths.packagesDir = (packagesDir) ? packagesDir : path.join('packages')
// paths.binDir = (binDir) ? binDir : path.join('bin')
// paths.package = (packageFile) ? path.join(packageFile) : path.join('package.json')
// paths.readmeName = (readmeName) ? readmeName : path.join('readme.md')
// paths.nodeModulesDir = path.join('node_modules')
// paths.nodeModulesDirDst = path.join(paths.nodeModulesDir, paths.name)
// paths.localModulesDirDst = path.join(paths.localModulesDir, paths.name)
// paths.readmeSrc = path.join(paths.docsDir, paths.name + '.md')
// paths.readmeDst = path.join(paths.localModulesDirDst, paths.readmeName)
// paths.bin = path.join(paths.binDir, paths.main)
// paths.packageBackup = path.join(paths.packagesDir, 'package-' + paths.name + '.json')
// paths.packageDst = path.join(paths.localModulesDirDst, 'package.json')

// var symlinks = []
//   return packageDeps(paths.main, paths.package)
//   .then(function (results) {
//     return Promise.props({
//       'readmeExists': fs.lstatAsync(paths.readme).then(R.T, R.F),
//       'binExists': fs.lstatAsync(paths.bin).then(R.T, R.F),
//       'moduleExists': fs.lstatAsync(paths.localModulesDirDst).then(R.T, R.F)
//     }).then(function (props) {
//       return _.extend(results, props)
//     })
//   })
//   .then(function (results) {
//     var links = []
//     links.push(results.testFiles)
//     links.push(results.deps.local)
//     links.push(results.binDeps.local)
//     links.push(results.devDeps.local)
//     links.push(results.deps.root)
//     if (results.binExists) links.push(paths.bin)
//     results.links = _.chain([links]).flattenDeep().unique().value()
//     return results
//   })
//   .then(function (results) {
//     var modulePackage = {}
//     modulePackage.name = paths.name
//     modulePackage.main = paths.main
//     modulePackage.version = '0.0.1'
//     if (packageDesc) modulePackage.description = packageDesc
//     if (results.binExists) modulePackage.bin = paths.bin
//     if (results.testFiles.length && dotty.exists(results, 'package.scripts.test')) dotty.put(modulePackage, 'scripts.test', results.package.scripts.test)
//     if (results.package.author) modulePackage.author = results.package.author
//     modulePackage.dependencies = results.pkgDeps.dependencies
//     modulePackage.devDependencies = results.pkgDeps.devDependencies
//     results.modulePackage = modulePackage
//     return results
//   })
//   .then(function (results) {
//     return promisePropsSeries({
//       'links': function () {
//         return moduleHarvest.makeLinks(results.links, paths.localModulesDirDst)
//       },
//       'package': function () {
//         return moduleHarvest.writePackage(paths.packageDst, paths.packageBackup, results.modulePackage)
//       },
//       'symlinkModule': function () {
//         return fs.ensureSymlinkAsync(paths.localModulesDirDst, paths.nodeModulesDirDst)
//           .then(moduleHarvest.debugMsg('symlinked module %s -> %s', paths.localModulesDirDst, paths.nodeModulesDirDst))
//           .catch(moduleHarvest.debugCatch)
//       },
//       'linkReadme': function () {
//         return fs.ensureLinkAsync(paths.readmeSrc, paths.readmeDst)
//           .then(moduleHarvest.debugMsg('link readme %s -> %s', paths.localModulesDirDst, paths.nodeModulesDirDst))
//           .catch(moduleHarvest.debugCatch)
//       },
//       'github': function () {
//         if (results.moduleExists) return false
//         if (!githubAccessToken) return false
//         var githubRepo = (githubRepoPrefix) ? githubRepoPrefix + paths.name : paths.name
//         return githubCreateRepo(githubAccessToken, githubRepo, packageDesc)
//         .then(function (repo) {
//           var url = repo[0].clone_url
//           debug('github repo created %s', url)
//           return git(paths.localModulesDirDst)
//           .init()
//           .add('./*')
//           .commit('init')
//           .addRemote('origin', url)
//           .push('origin', 'master')
//           .then(function () {
//             return repo
//           })
//         })
//         // .then(function () {
//         //   return fs.removeAsync(paths.localModulesDirDst)
//         //   .then(function () {
//         //     var comand = util.format('gits attach %s %s', repo, paths.localModulesDirDst)
//         //     exec(command)
//         //   })
//         // })
//       }
//     })
//   })
// }

// moduleHarvest.validateArguments = function (args, required) {
//   var issues = _.map(required, function (arg, type) {
//     if (!args[arg]) return util.format('missing required arg %s', arg)
//     if (!moduleHarvest.instanceOf(args[arg], type)) return util.format('expected type of arg %s to be %s recieved %s', type, args[arg], moduleHarvest.typeOf(args[arg]))
//   })
//   if (!issues.length) return true
//   return new Error(issues.join(', '))
// }

// function prettyPrint (msg) {
//   console.log(JSON.stringify(msg, null, 2))
// }

// return moduleHarvest.existingFiles(options.trackDeps)
// return moduleHarvest.buildLinks(options.buildLinks)
// return moduleHarvest.deps(options)

// moduleHarvest.returnFirst = function (arr) {
//   var values = []
//   _.each(arr, function (item) {
//     if (item) values.push(item)
//   })
//   return (values[0]) ? values[0] : false
// }

// .then(function () {
//   return fs.removeAsync(paths.localModulesDirDst)
//   .then(function () {
//     var comand = util.format('gits attach %s %s', repo, paths.localModulesDirDst)
//     exec(command)
//   })
// })

// /** alias arguments for bin */
// moduleHarvest.argsAlias = {
//   'moduleFile': ['file'],
//   'moduleName': ['name'],
//   'moduleDesc': ['desc'],
//   'moduleVersion': ['version'],
//   'packageSrc': ['package', 'pkg']
// }
