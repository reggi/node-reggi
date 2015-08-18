var _ = require("underscore")
var S = require("underscore.string")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs-extra"))
var path = require("path")
var lstatType = require("./lstat-type")

var log = function(value){
  console.log(value)
}

var options = [
  {
    "fnName": "ifDirectory",
    "fn": lstatType,
    "ifReturn": "directory",
  },
  {
    "fnName": "log",
    "fn": log,
    "offset": 1
  }
]

function nestedThen(arr, args){
  var promiseStore = []
  return Promise.each(arr, function(item, index, value){
    var _offset = (item.offset || 0)
    var _args = _.rest(args, _offset)

    if(promiseStore[index]){
      promiseStore[index].then(function(value){
        _.args.push(value)
      })
    }

    var promise = Promise.method(item.fn).apply(null, _args)
    promiseStore.push(promise)
    return promise
  })
}





var fn = function(str){
  Promise.resolve(str)
}

var fnPlus = function(str){
  Promise.resolve("plus"+str)
}

nestedThen([
  {
    fn:fn
  },
  {
    fn:fnPlus,
  },
], "hello")

//
// function stitchPromises(options, named){
//   var name = _.reduce(options, function(name, fnOptions){
//     if(name == "") return fnOptions.fnName
//     return name + S.capitalize(fnOptions.fnName)
//   }, "")
//
//   var fn = function(){
//
//   }
//
//   if(named) return [name, fn]
//   return fn
// }
//
// var ifDirectoryLog = stitchPromises(options)

//
// var lib = {}
//
// _.each(buildFns, function(buildFn){
//   var name = _.reduce(buildFn, function(name, operation){
//     if(name == "") return operation.fn[0]
//     return name + S.capitalize(operation.fn[0])
//   }, "")
//
//   var functions = _.map(buildFn, function(operation){
//     return operation.fn[1]
//   })
//
//   lib[name] = function(){
//     var args = _.values(arguments)
//
//     fnOne = Promise.method(buildFn[0].fn[1]).apply(null, args)
//     if(!buildFn[0].ifReturn) return fnOne
//     fnOne.then(function(value){
//       if(!buildFn[0].ifReturn == value)
//     })
//
//   }
//
// })


//
//
//
//
//
//   {
//     "prefix": {
//       "fn": lstatType,
//       "ifReturn": "directory",
//
//     },
//
//   }
// ]
//
// //
// // lib._wrapper([
// //   [lib.ifDirExistsAsync, 0, true],
// //   [lib.ensureLinkInDirAsync, 0],
// // ])
// //
// // lib._wrapper = function(){
// //   return function(){
// //     var args = arguments
// //
// //     cycle[0][0].apply(null, _.rest(args, cycle[0][1]))
// //       .then(function(value){
// //         if(cycle[0][2] == value)
// //       })
// //   }
// // }
//
// lib.ifFileExistsAsync = function(action, overlap){
//   return function(thePath){
//     var args = arguments
//     return lib.lstatTypeAsync(thePath).then(function(type){
//       if(type == "file") return action.apply(null, _.rest(args, overlap))
//       return false
//     })
//   }
// }
//
// lib.ifSymlinkExistsAsync = function(action, overlap){
//   return function(thePath){
//     var args = arguments
//     return lib.lstatTypeAsync(thePath).then(function(type){
//       if(type == "symbolicLink") return action.apply(null, _.rest(args, overlap))
//       return false
//     })
//   }
// }
//
// lib._prefixes = ["ifDirExistsAsync", "ifFileExistsAsync", "ifSymlinkExistsAsync"]
//
// lib.ensureLinkInDirAsync = function(theFile, dir){
//   var projectedDir = function(){
//     var theFileDir = path.dirname(theFile)
//     var intersection = _.intersection(theFileDir.split(path.sep), dir.split(path.sep))
//     var commonRoot = path.join.apply(null, intersection)
//     var difference = _.difference(theFileDir.split(path.sep), commonRoot.split(path.sep))
//     var newPaths = path.join.apply(null, difference)
//     return path.join(dir, newPaths)
//   }()
//   projectedFile = path.join(projectedDir, path.basename(theFile))
//   return lib.lstatTypeAsync(projectedFile).then(function(type){
//     if(type !== "file") throw new Error("file already exists")
//     return fs.mkdirsAsync(projectedDir).then(function(success){
//       return fs.linkAsync(theFile, projectedFile)
//     })
//   })
// }
//
// lib.ensureSymlinkInDirAsync = function(theFile, dir){
//   var projectedDir = function(){
//     var theFileDir = path.dirname(theFile)
//     var intersection = _.intersection(theFileDir.split(path.sep), dir.split(path.sep))
//     var commonRoot = path.join.apply(null, intersection)
//     var difference = _.difference(theFileDir.split(path.sep), commonRoot.split(path.sep))
//     var newPaths = path.join.apply(null, difference)
//     return path.join(dir, newPaths)
//   }()
//   projectedFile = path.join(projectedDir, path.basename(theFile))
//   return lib.lstatTypeAsync(projectedFile).then(function(type){
//     if(type !== "file") throw new Error("file already exists")
//     return fs.mkdirsAsync(projectedDir).then(function(success){
//       return fs.linkAsync(theFile, projectedFile, type)
//     })
//   })
// }
//
// lib._suffixOverlapZero = ["ensureLinkInDirAsync", "ensureSymlinkInDirAsync"]
//
// _.each(lib._prefixes, function(prefixName){
//   _.each(lib._suffixOverlapZero, function(suffixName){
//     var prefixFn = lib[prefixName]
//     var suffixFn = lib[suffixName]
//     var newName = prefixName.replace("Async", "") + S.capitalize(suffixName)
//     lib[newName] = prefixFn.apply(null, [suffixFn, 0])
//   })
// })
//
// lib.writeOrExtendJsonAsync = function(jsonFile, content){
//   return lib.lstatTypeAsync(jsonFile)
//   .then(function(type){
//     if(type == "file") return fs.readFileAsync(jsonFile, "utf8").then(JSON.parse)
//     if(path.extname(jsonFile !== ".json")) throw new Error("file is not json")
//     if(!type) return false
//     throw new Error("provided path is not file")
//   })
//   .then(function(fileContent){
//     if(!fileContent){
//       var writeContent = content
//     }else{
//       _.extend(fileContent, content)
//       var writeContent = fileContent
//     }
//     return fs.writeFileAsync(jsonFile, JSON.stringify(writeContent, null, 2))
//   })
// }
//
// console.log(lib)
//
// _.extend(fs, lib)
//
// console.log(fs)
//
// module.exports = fs

//
// ifDirExists = return function(thePath){
//   return lstatType(thePath).then(function(type){
//     if(type == "directory") return true
//     return false
//   })
// }
//
// ifFileExists = return function(thePath){
//   return lstatType(thePath).then(function(type){
//     if(type == "file") return true
//     return false
//   })
// }
