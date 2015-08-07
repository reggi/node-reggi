var _ = require('lodash')
var util = require('util')
var assert = require('assert')
var path = require('path')
var chdirTemp = require('../test-chdir-temp')
var fauxProject = require('../faux-project')
var recursiveDeps = require('../recursive-deps')
var DESC = path.basename(__filename, path.extname(__filename))
var assimilate = require('../assimilate')

/* global describe, it */

function fauxRecursiveDeps (options) {
  var root = path.join(options.root)
  var allDeps = _.flattenDeep([options.root, _.keys(options.modules), _.values(options.modules)])
  var expected = _.groupBy(allDeps, function (dep) {
    return recursiveDeps.depType(dep)
  })
  expected.root = [root]
  expected.local = _.chain(options.modules)
    .keys()
    .map(function (dep) {
      return path.join(dep)
    })
    .filter(function (dep) {
      return root !== path.join(dep)
    })
    .value()
  if (!expected.local) expected.local = []
  if (!expected.npm) expected.npm = []
  if (!expected.native) expected.native = []
  if (!expected.invalid) expected.invalid = []
  return expected
}

var tests = [
  {
    'deps': ['underscore'],
    'root': './one.js',
    'modules': {
      './one.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './dir/two.js',
    'modules': {
      './dir/two.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './three.js',
    'modules': {
      './three.js': ['./four.js'],
      './four.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './five.js',
    'modules': {
      './five.js': ['./dir/six.js'],
      './dir/six.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './seven.js',
    'modules': {
      './seven.js': ['./eight.js'],
      './eight.js': ['./nine.js'],
      './nine.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './ten.js',
    'modules': {
      './ten.js': ['./dir/eleven.js'],
      './dir/eleven.js': ['./dir/twelve.js'],
      './dir/dir/twelve.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './thirteen.js',
    'modules': {
      './thirteen.js': ['./dir/dir/dir/dir/fourteen.js'],
      './dir/dir/dir/dir/fourteen.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './fifteen.js',
    'modules': {
      './fifteen.js': ['./dir/dir/dir/dir/sixteen.js'],
      './dir/dir/dir/dir/sixteen.js': ['../../../../foo/seventeen.js'],
      './foo/seventeen.js': ['underscore']
    }
  },
  {
    'deps': ['underscore'],
    'root': './eighteen.js',
    'modules': {
      './eighteen.js': ['./nineteen.js'],
      './nineteen.js': ['./twenty.js'],
      './twenty.js': ['underscore']
    }
  }
]

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  tests.forEach(function (test) {
    var packageArgs = []
    if (test.deps) packageArgs.push(test.deps)
    if (test.devDeps) packageArgs.push(test.devDeps)
    var should = util.format('should return recursive deps for %s', test.root)
    it(should, function () {
      fauxProject(packageArgs, test.modules)
      var expected = fauxRecursiveDeps(test)
      return recursiveDeps.mapRelativePaths(test.root).then(function (deps) {
        assert.equal(assimilate(deps), assimilate(expected))
      })
    })
  })

})

// var path = require('path')
// var util = require('util')
// var assert = require('assert')
// var _ = require('lodash')
// // var fs = require('fs-extra')
// var chdirTemp = require('../test-chdir-temp')
// var fauxProject = require('../faux-module')
// var recursiveDeps = require('../recursive-deps')
// // var assimilate = require('../assimilate')
//
// /* global describe, it */
//
// var behavior = {}
//
// behavior.success = function (root, modules, expected, key) {
//   var should = util.format('should return deps sucessfully given key %s', key)
//   it(should, function () {
//     fauxProject.modules(modules)
//     return recursiveDeps.mapRelativePaths(root).then(function (deps) {
//       assert.deepEqual(deps, expected)
//     })
//   })
// }
//
// function fauxRecursiveDeps (options) {
//   var root = path.join(options.root)
//   var allDeps = _.flattenDeep([options.root, _.keys(options.modules), _.values(options.modules)])
//   var expected = _.groupBy(allDeps, function (dep) {
//     return recursiveDeps.depType(dep)
//   })
//   expected.root = [root]
//   expected.local = _.chain(options.modules)
//     .keys()
//     .map(function (dep) {
//       return path.join(dep)
//     })
//     .filter(function (dep) {
//       return root !== path.join(dep)
//     })
//     .value()
//
//   if (!expected.local) expected.local = []
//   if (!expected.npm) expected.npm = []
//   if (!expected.native) expected.native = []
//   if (!expected.invalid) expected.invalid = []
//
//   options.expected = expected
//   return options
// }
//
// var tests = [
//   fauxRecursiveDeps({
//     'behavior': behavior.success,
//     'root': './module.js',
//     'modules': {
//       './module.js': ['./sibling.js'],
//       './sibling.js': ['underscore']
//     }
//   }),
//   fauxRecursiveDeps({
//     'behavior': behavior.success,
//     'root': './module.js',
//     'modules': {
//       './module.js': ['./sibling.js'],
//       './sibling.js': ['underscore', 'url']
//     }
//   }),
//   fauxRecursiveDeps({
//     'behavior': behavior.success,
//     'root': './folder/module.js',
//     'modules': {
//       './folder/module.js': ['../root.js'],
//       './root.js': ['underscore']
//     }
//   }),
//   fauxRecursiveDeps({
//     'behavior': behavior.success,
//     'root': './folder/module.js',
//     'modules': {
//       './folder/module.js': ['../root.js', 'path'],
//       './root.js': ['underscore']
//     }
//   })
// ]
//
// describe('recursive-deps', function () {
//   chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')
//
//   tests.forEach(function (test, key) {
//     test.expected = (test.expected) ? test.expected : false
//     return test.behavior(test.root, test.modules, test.expected, key)
//   })
//
// })

//
//
//
//
// var CWD = process.cwd()
// // var _ = require('lodash')
// var util = require('util')
// var assert = require('assert')
// var path = require('path')
// var os = require('os')
// var Promise = require('bluebird')
// var fs = Promise.promisifyAll(require('fs-extra'))
// var recursiveDeps = require('../recursive-deps')
// // var yaml = require('js-yaml')
// // var ymlTests = fs.readFileSync(path.join(__dirname, './recursive-deps-tests.yml'), 'utf8')
// // var tests = yaml.safeLoad(ymlTests)
// // var ymlFiles = fs.readFileSync(path.join(__dirname, './recursive-deps-files.yml'), 'utf8')
// // var files = yaml.safeLoad(ymlFiles)
// var tests = require('./recursive-deps-tests.json')
// var files = require('./recursive-deps-files.json')
// //
//
// /* global describe, before, after, beforeEach, afterEach, it */
//
// var ROOT_DESC = 'recursive-deps'
// var TEST_DIR = path.join(os.tmpdir(), ROOT_DESC)
//
// function clean (expected) {
//   if (!expected.local) expected.local = []
//   if (!expected.npm) expected.npm = []
//   if (!expected.native) expected.native = []
//   return expected
// }
//
// describe(ROOT_DESC, function () {
//
//   before(function () {
//     fs.emptyDirSync(TEST_DIR)
//     process.chdir(TEST_DIR)
//   })
//
//   beforeEach(function () {
//     return Promise.map(files, function (file) {
//       return fs.ensureFileAsync.apply(null, file)
//     })
//   })
//
//   afterEach(function () {
//     fs.emptyDirSync(TEST_DIR)
//   })
//
//   after(function () {
//     process.chdir(CWD)
//     fs.removeSync(TEST_DIR)
//   })
//
//   it('should have mock file system', function () {
//     assert.equal(process.cwd().indexOf(TEST_DIR) > -1, true)
//   })
//
//   tests.forEach(function (test) {
//     var should
//     var args = test.arguments
//     test.authoredPaths = (test.authoredPaths) ? clean(test.authoredPaths) : clean({})
//     test.relativePaths = (test.relativePaths) ? clean(test.relativePaths) : test.authoredPaths
//
//     should = util.format('should return deps as authored for %s', args[0])
//     it(should, function () {
//       return recursiveDeps.mapAuthoredPaths.apply(null, args).then(function (deps) {
//         // console.log(JSON.stringify(deps, null, 2))
//         assert.deepEqual(deps.local.sort(), test.authoredPaths.local.sort())
//         assert.deepEqual(deps.native.sort(), test.authoredPaths.native.sort())
//         assert.deepEqual(deps.npm.sort(), test.authoredPaths.npm.sort())
//       })
//     })
//
//     should = util.format('should return deps relative for %s', args[0])
//     it(should, function () {
//       return recursiveDeps.mapRelativePaths.apply(null, args).then(function (deps) {
//         // console.log(JSON.stringify(deps, null, 2))
//         assert.deepEqual(deps.local.sort(), test.relativePaths.local.sort())
//         assert.deepEqual(deps.native.sort(), test.relativePaths.native.sort())
//         assert.deepEqual(deps.npm.sort(), test.relativePaths.npm.sort())
//       })
//     })
//
//   })
//
// })
