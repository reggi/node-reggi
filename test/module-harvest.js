var _ = require('lodash')
var util = require('util')
var Promise = require('bluebird')
var path = require('path')
var assert = require('assert')
var fs = require('fs-extra')
var chdirTemp = require('../test-chdir-temp')
var fauxProject = require('../faux-project')
var moduleHarvest = require('../module-harvest')
var tests = require('./data-project-definitions')
var DESC = path.basename(__filename, path.extname(__filename))

/* global describe, it */

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  describe('moduleHarvest()', function () {
    tests.forEach(function (project) {
      var should = util.format('should build module for %s', project.root)
      it(should, function () {
        fauxProject(project)
        var moduleName = path.basename(project.root, path.extname(project.root))
        return moduleHarvest(project.root).then(function () {

          // used for some more scoping to see the dir tree itself, hoping for node alternative
          // http://stackoverflow.com/questions/31817199/visual-filesystem-directory-tree-string
          // var exec = require('child_process').exec
          // exec('tree', function (error, stdout, stderr) {
          //   console.log('stdout: ' + stdout)
          // })
          // console.log(fs.readdirSync('./'))

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
          // console.log(pkg)
          // console.log(expectedPkg)
          assert.deepEqual(pkg.dependencies, expectedPkg.dependencies)
          assert.deepEqual(pkg.devDependencies, expectedPkg.devDependencies)
        })
      })
    })
  })

  describe('moduleHarvest.buildLinks()', function () {
    it('should create link alpha', function () {
      fs.writeFileSync('alpha.js', 'foo\n')
      var links = [
        ['./alpha.js', './dir/alpha.js']
      ]
      return moduleHarvest.buildLinks(links)
      .then(function (value) {
        assert.deepEqual(fs.readdirSync('./'), ['alpha.js', 'dir'])
      })
    })
    it('should create link alpha and optional beta', function () {
      fs.writeFileSync('alpha.js', 'foo\n')
      var links = [
        ['./alpha.js', './dir/alpha.js'],
        ['./beta.js', './dir/beta.js']
      ]
      return moduleHarvest.buildLinks(links)
      .then(function (value) {
      })
    })
    it('should create link first', function () {
      fs.writeFileSync('alpha-foo.js', 'foo\n')
      fs.writeFileSync('alpha-bar.js', 'bar\n')
      var links = [
        ['./alpha-foo.js', './dir/alpha.js'],
        ['./alpha-bar.js', './dir/alpha.js']
      ]
      return moduleHarvest.buildLinks(links)
      .then(function (value) {
        assert.deepEqual(fs.readdirSync('./dir'), ['alpha.js'])
        assert.equal(fs.readFileSync('./dir/alpha.js', 'utf8'), 'foo\n')
      })
    })
    it('should create link second', function () {
      fs.writeFileSync('alpha-bar.js', 'bar\n')
      var links = [
        ['./alpha-foo.js', './dir/alpha.js'],
        ['./alpha-bar.js', './dir/alpha.js']
      ]
      return moduleHarvest.buildLinks(links)
      .then(function (value) {
        assert.deepEqual(fs.readdirSync('./dir'), ['alpha.js'])
        assert.equal(fs.readFileSync('./dir/alpha.js', 'utf8'), 'bar\n')
      })
    })
  })

  describe('moduleHarvest.prefaceLinkArgs()', function () {
    it('should create link alpha', function () {
      fs.writeFileSync('alpha.js', 'foo\n')
      var srcDir = './'
      var dstDir = './dir'
      var links = [
        ['alpha.js', 'alpha.js']
      ]
      return Promise.method(moduleHarvest.prefaceLinkArgs)(links, srcDir, dstDir)
      .then(moduleHarvest.buildLinks)
      .then(function (value) {
        assert.deepEqual(fs.readdirSync('./'), ['alpha.js', 'dir'])
      })
    })
    it('should create link alpha and optional beta', function () {
      fs.writeFileSync('alpha.js', 'foo\n')
      var srcDir = './'
      var dstDir = './dir'
      var links = [
        ['alpha.js', 'alpha.js'],
        ['beta.js', 'beta.js']
      ]
      return Promise.method(moduleHarvest.prefaceLinkArgs)(links, srcDir, dstDir)
      .then(moduleHarvest.buildLinks)
      .then(function (value) {
      })
    })
    it('should create link first', function () {
      fs.writeFileSync('alpha-foo.js', 'foo\n')
      fs.writeFileSync('alpha-bar.js', 'bar\n')
      var srcDir = './'
      var dstDir = './dir'
      var links = [
        ['alpha-foo.js', 'alpha.js'],
        ['alpha-bar.js', 'alpha.js']
      ]
      return Promise.method(moduleHarvest.prefaceLinkArgs)(links, srcDir, dstDir)
      .then(moduleHarvest.buildLinks)
      .then(function (value) {
        assert.deepEqual(fs.readdirSync('./dir'), ['alpha.js'])
        assert.equal(fs.readFileSync('./dir/alpha.js', 'utf8'), 'foo\n')
      })
    })
    it('should create link second', function () {
      fs.writeFileSync('alpha-bar.js', 'bar\n')
      var srcDir = './'
      var dstDir = './dir'
      var links = [
        ['alpha-foo.js', 'alpha.js'],
        ['alpha-bar.js', 'alpha.js']
      ]
      return Promise.method(moduleHarvest.prefaceLinkArgs)(links, srcDir, dstDir)
      .then(moduleHarvest.buildLinks)
      .then(function (value) {
        assert.deepEqual(fs.readdirSync('./dir'), ['alpha.js'])
        assert.equal(fs.readFileSync('./dir/alpha.js', 'utf8'), 'bar\n')
      })
    })
  })

  describe('moduleHarvest.existingFiles()', function () {
    it('should filter files return one', function () {
      fs.writeFileSync('alpha.js', 'foo\n')
      var links = [
        './alpha-foo.js',
        './alpha.js',
        './beta.js'
      ]
      return moduleHarvest.existingFiles(links)
      .then(function (value) {
        assert.deepEqual(value, ['./alpha.js'])
      })
    })
    it('should filter files return multiple', function () {
      fs.writeFileSync('beta.js', 'foo\n')
      fs.writeFileSync('alpha.js', 'foo\n')
      var links = [
        './alpha-foo.js',
        './alpha.js',
        './beta.js'
      ]
      return moduleHarvest.existingFiles(links)
      .then(function (value) {
        assert.deepEqual(value, ['./alpha.js', './beta.js'])
      })
    })
  })

  describe('moduleHarvest.configFileArgs()', function () {

    it('should return {} when no config files', function () {
      return moduleHarvest.configFileArgs()
      .then(function (value) {
        assert.deepEqual(value, {})
      })
    })

    it('should return value when harvest.config.js returns object', function () {
      var data = {'foo': 'bar'}
      fs.writeFileAsync('./harvest.config.js', util.format('module.exports = %s', JSON.stringify(data)))
      return moduleHarvest.configFileArgs()
      .then(function (value) {
        assert.deepEqual(value, data)
      })
    })

    it('should return value when harvest.config.json', function () {
      var data = {'foo': 'bar'}
      fs.writeFileAsync('./harvest.config.json', JSON.stringify(data, null, 2))
      return moduleHarvest.configFileArgs()
      .then(function (value) {
        assert.deepEqual(value, data)
      })
    })

    it('should return value when harvest.config.json returns function', function () {
      var data = {'foo': 'bar'}
      fs.writeFileAsync('./harvest.config.js', util.format('module.exports = function () { return %s }', JSON.stringify(data)))
      return moduleHarvest.configFileArgs()
      .then(function (value) {
        assert.deepEqual(value, data)
      })
    })

    it('should return multiple file values', function () {
      var data
      data = {'alpha': 'one'}
      fs.writeFileAsync('./harvest.config.js', util.format('module.exports = %s', JSON.stringify(data)))
      data = {'beta': 'two'}
      fs.writeFileAsync('./harvest.config.json', JSON.stringify(data, null, 2))
      data = {'gamma': 'three'}
      fs.writeFileAsync('./harvest.secret.js', util.format('module.exports = function () { return %s }', JSON.stringify(data)))
      data = {'delta': 'four'}
      fs.writeFileAsync('./harvest.secret.json', JSON.stringify(data, null, 2))
      return moduleHarvest.configFileArgs()
      .then(function (value) {
        assert.deepEqual(value, {
          'alpha': 'one',
          'beta': 'two',
          'gamma': 'three',
          'delta': 'four'
        })
      })
    })

    it('should return multiple file values when passed fn args', function () {
      var data
      data = {'alpha': 'one'}
      fs.writeFileAsync('./harvest.config.js', util.format('module.exports = %s', JSON.stringify(data)))
      data = {'beta': 'two'}
      fs.writeFileAsync('./harvest.config.json', JSON.stringify(data, null, 2))
      data = {'gamma': 'three'}
      fs.writeFileAsync('./harvest.secret.js', util.format('module.exports = function (args) { var opts = %s;\n args.gamma = opts.gamma + args.gamma;\n return args }', JSON.stringify(data)))
      data = {'delta': 'four'}
      fs.writeFileAsync('./harvest.secret.json', JSON.stringify(data, null, 2))
      return moduleHarvest.configFileArgs({'gamma': 'bar'})
      .then(function (value) {
        assert.deepEqual(value, {
          'alpha': 'one',
          'beta': 'two',
          'gamma': 'threebar',
          'delta': 'four'
        })
      })
    })

  })

})
