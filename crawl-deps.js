var path = require("path")
var _ = require("underscore")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require('fs'))
var acorn = require("acorn")
var umd = require("acorn-umd")
var natives = Object.keys(process.binding('natives'))

function crawlDep(src){
  var ast = acorn.parse(src, {
    sourceType: "module",
    ecmaVersion: 6
  })
  return umd(ast, {
      es6: true, amd: false, cjs: true
  })
}

function getRecursiveDeps(deps, localRegex){
  return _.chain(deps)
    .map(function(dep){
      return dep.source.value
    })
    .filter(function(dep){
      return dep.match(localRegex)
    })
    .value()
}

function recursiveDeps(filePath, deps, localRegex){
  var allDeps = []
  function _recursiveDeps(deps){
    return Promise.map(deps, function(dep){
      var ext = path.extname(filePath)
      var depFilePath = path.join(filePath, "..", dep+ext)
      return fs.readFileAsync(depFilePath).then(crawlDep)
    }).then(function(newDeps){
      newDeps = _.flatten(newDeps)
      allDeps.push(newDeps)
      if(newDeps.length == 0 ) return allDeps
      var getDeps = getRecursiveDeps(newDeps, localRegex)
      return _recursiveDeps(getDeps)
    })
  }
  return _recursiveDeps(deps)
}

function crawlDeps(filePath, localRegex){
  localRegex = (localRegex || /^.\.\/|^.\/|^\//)
  return fs.readFileAsync(filePath)
  .then(crawlDep)
  .then(function(deps){
    return Promise.method(getRecursiveDeps)(deps, localRegex)
    .then(function(deps){
      return recursiveDeps(filePath, deps, localRegex)
    })
    .then(function(restDeps){
      return _.chain([deps, restDeps])
      .flatten()
      .value()
    })
  })
}

crawlDeps.localRegex = /^.\.\/|^.\/|^\//

crawlDeps.sort = function(ogDeps){
  var deps = {}
  deps.local = _.filter(ogDeps, function(dep){
    return dep.source.value.match(crawlDeps.localRegex)
  })
  deps.native = _.filter(ogDeps, function(dep){
    return _.contains(natives, dep.source.value)
  })
  deps.npm = _.filter(ogDeps, function(dep){
    return !dep.source.value.match(crawlDeps.localRegex) && !_.contains(natives, dep.source.value)
  })
  return deps
}

crawlDeps.sortAssignNatives = function(natives){
  return function(ogDeps){
    return crawlDeps._sort(ogDeps, natives)
  }
}

crawlDeps.getValues = function(sortedDeps){
  return _.mapObject(sortedDeps, function(sortedDepType){
    return _.chain(sortedDepType)
      .map(function(sortedDep){
        return sortedDep.source.value
      })
      .unique()
      .value()
  })
}

module.exports = crawlDeps
