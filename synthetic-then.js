var _ = require("underscore")
var Promise = require("bluebird")
var fs = Promise.promisifyAll(require("fs"))
var fsRedux = require("./fs-redux")
var suppress = function(e){ return e }

var fileSysemPath = function(path){
  if (!(this instanceof fileSysemPath)) return new fileSysemPath(path);
  this._path = path
  this._promises = []
}

fileSysemPath.prototype.path = function(path){
  this._path = path
  return this
}

fileSysemPath.prototype.ifType = function(typeDesired){
  var promise = function(){
    return fs.lstatAsync(this._path).then(function(stats){
      if(stats.isFile()) return "file"
      if(stats.isDirectory()) return "directory"
      if(stats.isBlockDevice()) return "blockedDevice"
      if(stats.isCharacterDevice()) return "characterDevice"
      if(stats.isSymbolicLink()) return "symbolicLink"
      if(stats.isFIFO()) return "FIFO"
      if(stats.isSocket()) return "socket"
      return "unknownType"
    }).then(function(type){
      if(typeDesired !== type) throw new Error("type is not desired type")
      return type
    })
  }
  this._promises.push(promise)
  return this
}

fileSysemPath.prototype.toPromise = function(){
  var _this = this
  return Promise.reduce(this._promises, function(result, action){
    return action.apply(_this, [])
  }, false)
}

fileSysemPath.prototype.then = function(fn){
  var _this = this
  return Promise.reduce(this._promises, function(result, action){
    return action.apply(_this, [])
  }, false).then(fn)
}

// set each fs prototype
_.each(fs, function(fn, name){
  if(name.match(/Async/) && !name.match(/Sync/)){
    name = name.replace("Async", "")
    fileSysemPath.prototype[name] = function(){
      var args = _.values(arguments)
      args.unshift(this._path)
      var promise = function(){
        return Promise.method(fn).apply(null, args)
      }
      this._promises.push(promise)
      return this
    }
  }
})

_.each(fsRedux, function(fn, name){
  fileSysemPath.prototype[name] = function(){
    var args = _.values(arguments)
    args.unshift(this._path)
    var promise = function(){
      return Promise.method(fn).apply(null, args)
    }
    this._promises.push(promise)
    return this
  }
})

// fileSysemPath("./package.json").readFile("utf8").toPromise()
//   .catch(suppress)
//   .then(console.log)

fileSysemPath("./package.json").ifType("file").readFile("utf8").toPromise()
  .catch(suppress)
  .then(console.log)


// var x = Promise.reduce(x._promises, function(result, action){
//   return action().then()
// }, "")

// x._promises[0]().then(console.log)
//
// x.then(function(value){
//   console.log(value)
// })

// var read = _.partialRight(fs.readFileAsync, "utf8")
//
// read("./package.json").then(console.log)
//
// var x = Promise.reduce([_.partialRight(fs.readFileAsync, "utf8")], function(result, action){
//   return action(result)
// }, "./package.json").catch()
//
// x.then(console.log)

// console.log(x)

// .then(function(data){
//   console.log(data)
// })







// var _ = require("underscore")
// var Promise = require("bluebird")
// var fs = Promise.promisifyAll(require("fs"))
//
// //
// // var fsAsync =_.chain(_.clone(fs))
// // .map(function(method, prop){
// //   return [prop, method]
// // })
// // .filter(function(arr){
// //   if(arr[0].match(/Sync/)) return false
// //   if(arr[0].match(/Async/)) return true
// //   return false
// // })
// // .map(function(arr){
// //   return [arr[0].replace("Async", ""), arr[1]]
// // })
// // .object()
// // .value()
//
// var hello = function(str){
//   return Promise.resolve(str+ "hello")
// }
// var world = function(str){
//   return Promise.resolve(str+ "world")
// }
// var foo = function(str){
//   return Promise.resolve(str+ "foo")
// }
// var bar = function(str){
//   return Promise.resolve(str+ "bar")
// }
//
// // hello("alpha").then(world).then(foo).then(bar).then(console.log)
// // => alphahelloworldfoobar
//
// var result = Promise.reduce([hello, world, foo, bar], function(result, action){
//     return action(result);
// }, "alpha");
//
// result.then(console.log)
//
//
// //
// //
// //
// //
// // fs.readFile("myFile").then(_.partialRight(parse, {columns: true}));
// //
// // var fileSysemPath = function(){
// //   this._path = false
// //   this._promises = []
// // }
// //
// // fileSysemPath.prototype.path = function(path){
// //   this._path = path
// //   return this
// // }
// //
// // fileSysemPath.prototype.ifType = function(typeDesired){
// //   if(this._error) return this._error
// //   var promise = fs.lstatAsync(this._path).then(function(stat){
// //     if(stats.isFile()) return "file"
// //     if(stats.isDirectory()) return "directory"
// //     if(stats.isBlockDevice()) return "blockedDevice"
// //     if(stats.isCharacterDevice()) return "characterDevice"
// //     if(stats.isSymbolicLink()) return "symbolicLink"
// //     if(stats.isFIFO()) return "FIFO"
// //     if(stats.isSocket()) return "socket"
// //     return "unknownType"
// //   }).catch(function(){
// //     return false
// //   }).then(function(type){
// //     if(type == typeDesired) return this
// //     this._error = true
// //   })
// //   _.extend(promise, this)
// //   return promise.then(function(){
// //
// //   })
// // }
// //
// //
// //
// // _.each(fs, function(fn, name){
// //   if(name.match(/Async/) && !name.match(/Sync/)){
// //     name = name.replace("Async", "")
// //     fileSysemPath.prototype[name] = function(){
// //       if(this._error) return this._error
// //       var args = _.values(arguments)
// //       args.unshift(this._path)
// //       var promise = fn.apply(null, args)
// //       _.extend(promise, this)
// //       return promise
// //     }
// //   }
// // })
// //
// // var fsc = new fileSysemPath()
// //
// // console.log(fsc.__proto__)
// //
// // fsc.path("./package.json").ifType("dir").readFile("utf8").then(function(data){
// //   console.log(data)
// // })
//
//
// // // filePath("../package.json").type().ifFile().writeFile("./hello.txt", "hello")
// // //
// // // function filePath(path){
// // //
// // // }
// // //
// // // filePath.type(path){
// // //   return fsLstatType(path)
// // // }
// // //
// // // filePath("../package.json").then(fsLstatType).if("file").writeFile("./hello.txt", "hello")
// // //
// // // fsLstatType("../package.json").then(function(type){
// // //   if(type == "file") return fs.writeFileAsync("./hello.txt", "hello")
// // // })
// //
// // // sync then
// //
// // // var x = buildFn(lib, "ifPathFile", "consoleLog").syncThen(match)
// // //
// // // console.log(x) // not promise
// //
// //
// // // works with async code
// // var promise = chain(cloneLib).readFile("package.json", "utf8").passValueTo.appendString("world")
// // promise.should.eventually.equal("hello world")
// //
// // // works with sync code
// // var fn = chain.(fnReproduce).buildFn(cloneLib, "readFile", "appendString").prepend(2)
// // expect(fn).to.be.instanceof(Function)
// //
// // //chain.match(fnIfExists).file("./package.json").ifType("file").
// // var fs = chain(chainFs)
// //
// // fs.path(srcpath).if.path.type("file").ensure.path.is.link.in.dir(dstdir)
// // fs.path(srcpath).if.path.type("file").ensure.path.is.link(dstpath)
// // fs.path(srcpath).write.to.path("hello")
// // fs.path(srcpath).rename()
// // fs.oldpath(oldPath).newpath(newPath).rename()
// // fs.path(path).lstat().if.isSymlink().unlink()
// //
// // fs.path(path).if.isSymlink().unlink()
// //
// // fs.symlink(srcpath, dstpath[, type], callback)#
// //
// // fs.path(srcPath).type().symlink(dstpath)
// //
// // function fs(){
// //   this._values = []
// //   return this
// // }
// //
// // fs.prototype.path = function(str){
// //   this.path = str
// //   return this
// // }
// //
// // fs.prototype.type = function(){
// //   return fsLstatType(this.path).then(function(type){
// //     this._values.push(type)
// //     this.type = type
// //     return this
// //   })
// // }
// //
// // fs.prototype.symlink = function(dstpath, type){
// //   type = (type) ? type : (this.type) ? this.type : null
// //   return fs.symlinkAsync(this.path, dstpath, type).then(function(value){
// //     this._values.push(value)
// //     return this
// //   })
// // }
// //
// // fs.protyotype.ifType = function(checkType){
// //   if(this.type){
// //     if(this.type == checkType) return this
// //     return false
// //   }else{
// //     return fsLstatType(this.path).then(function(type){
// //       this.type = checkType
// //       if(this.type == checkType) return this
// //       return false
// //     })
// //   }
// // }
// //
// // fs.path("./pacakge.json").type().ifType("file").ensureLinkInDir()
// //
// //
// // fs.prototype.symlink(srcpath, dstpath[, type], callback)#
// //
// // fs.ifFileExistsEnsureLinkInDirAsync(paths.readmeFile, paths.newModuleDir).catch(suppress),
// //
// // // Takes object method and prototypes each method
// // // Uses `match` and `prepend` types
// //
// //
// //       var cloneLib = _.clone(lib)
// //       var newFn = fnReproduce.buildFnPrependArgs(cloneLib, "readFile", "appendString", 2)
// //       expect(newFn).to.have.property("readFileAppendString")
// //       _.extend(cloneLib, newFn)
// //       expect(cloneLib).to.have.property("readFileAppendString")
// //       return cloneLib.readFileAppendString("package.json", "utf8", "world").should.eventually.equal("hello world")
// //
// // var _ = require("underscore")
// //
// // var syncThen = function(){
// //   if (!(this instanceof syncThen)) return new syncThen();
// //   this._next
// // }
// //
// // function addTwo(num){
// //   return num + 2
// // }
// //
// // syncThen.prototype.addTwo = function(){
// //   var args = _.values(arguments)
// //   var value = addTwo.apply(null, args)
// //   this._next = value
// //   return this
// // }
// //
// // syncThen.prototype.then = function(fn){
// //   this._next = fn(this._next)
// //   return this
// // }
// //
// // syncThen.prototype.value = function(fn){
// //   return this._next
// // }
// //
// // var x = syncThen().addTwo(3).then(function(value){
// //   return value
// // }).value()
// //
// // console.log(x)
