var _ = require('lodash')
var util = require('util')
var path = require('path')
var assert = require('assert')
var fs = require('fs-extra')
var chdirTemp = require('../test-chdir-temp')
var fauxProject = require('../faux-project')
var moduleBuilder = require('../module-builder')
var tests = require('./data-project-definitions')
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  tests.forEach(function (project) {
    var should = util.format('should build module for %s', project.root)
    it(should, function () {
      fauxProject(project)
      var moduleName = path.basename(project.root, path.extname(project.root))
      return moduleBuilder(project.root).then(function () {

        var paths = [
          [path.join('./local_modules'), 'isDirectory'],
          [path.join('./local_modules', moduleName), 'isDirectory'],
          [path.join('./node_modules/', moduleName), 'isSymbolicLink']
        ]
        var files = _.flatten(_.keys(project.modules), _.keys(project.files), _.keys(project.tests), project.root)
        _.each(files, function (dep) {
          paths.push([dep, 'isFile'])
        })
        paths.forEach(function (items) {
          assert.equal(fs.lstatSync(items[0])[items[1]](), true)
        })
        var pkgPath = path.join('./local_modules/', moduleName, '/package.json')
        var pkg = fs.readJsonSync(pkgPath)
        var deps = (project.deps) ? project.deps : []
        var devDeps = (project.devDeps) ? project.devDeps : []
        var expectedPkg = fauxProject.package(deps, devDeps)
        if(!pkg.devDependencies) pkg.devDependencies = {}
        assert.deepEqual(pkg.dependencies, expectedPkg.dependencies)
        assert.deepEqual(pkg.devDependencies, expectedPkg.devDependencies)
      })
    })
  })
})
