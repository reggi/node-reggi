## Modules
<dl>
<dt><a href="#module_fn-reproduce">fn-reproduce</a></dt>
<dd><p>Take two functions and stitch them together to make a third, that interacts with parent arguments.</p>
</dd>
<dt><a href="#module_fn-with-name-prop">fn-with-name-prop</a> ⇒ <code>function</code></dt>
<dd><p><code>npm install fn-with-name-prop --save</code></p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#arrCamelize">arrCamelize(arr)</a> ⇒ <code>String</code></dt>
<dd><p>Joins array and camel cases each word</p>
</dd>
<dt><a href="#arrExtend">arrExtend(arr)</a> ⇒ <code>Object</code></dt>
<dd><p>Builds an object from an array of objects.
Orignated in this Stackoverflow post <a href="http://stackoverflow.com/questions/20103565/convert-array-of-objects-to-just-one-object">&quot;Convert array of objects to just one object&quot;</a>.</p>
</dd>
<dt><a href="#arrExtract">arrExtract(arr, recursiveProperty)</a> ⇒ <code>Array</code></dt>
<dd><p>Flatten a array-object via recursive property</p>
</dd>
<dt><a href="#assimilate">assimilate()</a></dt>
<dd><p>turn the contents of array or object into sorted string</p>
</dd>
<dt><a href="#fauxProject">fauxProject()</a></dt>
<dd><p>creates a dummy project in the current directory</p>
</dd>
<dt><a href="#fnThrow">fnThrow()</a></dt>
<dd><p>Returns a function that throws an error.</p>
</dd>
<dt><a href="#fnToMethod">fnToMethod([fn], [fnName], [objFns])</a> ⇒ <code>Object</code></dt>
<dd><p>Way of standardizing and naming a function.</p>
</dd>
<dt><a href="#fsExists">fsExists(thePath)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Checks if a path exists on the file System</p>
</dd>
<dt><a href="#fsStats">fsStats(stats)</a> ⇒ <code>String</code></dt>
<dd><p>Given stats from fs.lstat or fs.stat will return type</p>
</dd>
</dl>
<a name="module_fn-reproduce"></a>
## fn-reproduce
Take two functions and stitch them together to make a third, that interacts with parent arguments.

**Example**  
```js
_.extend(lib, fnReproduce.buildFnPrependArgs(lib, 'readFile', 'appendString', 2))
lib.readFileAppendString('hello.txt', 'utf8', 'world').should.eventually.equal('hello world')
```

* [fn-reproduce](#module_fn-reproduce)
  * [~_match(fns, [childArgOffset], [matchValue], [nonMatchValue])](#module_fn-reproduce.._match) ⇒ <code>Object</code>
  * [~_prependArgs(fns, [childArgOffset])](#module_fn-reproduce.._prependArgs) ⇒ <code>Object</code>
  * [~_buildFn(obj, parentName, childName)](#module_fn-reproduce.._buildFn) ⇒ <code>Object</code>
  * [~buildFn(obj, parentName(s), childrenName(s))](#module_fn-reproduce..buildFn) ⇒ <code>Object</code>
  * [~prependArgs(fns|fnsArr, [childArgOffset])](#module_fn-reproduce..prependArgs) ⇒ <code>Object</code>
  * [~match(fns, [childArgOffset], [matchValue], [nonMatchValue])](#module_fn-reproduce..match) ⇒ <code>Object</code>
  * [~buildFnMatch(obj, parentName(s), childrenName(s), [childArgOffset], [matchValue], [nonMatchValue])](#module_fn-reproduce..buildFnMatch) ⇒ <code>Object</code>
  * [~buildFnPrependArgs(obj, parentName(s), childrenName(s), [childArgOffset])](#module_fn-reproduce..buildFnPrependArgs) ⇒ <code>Object</code>

<a name="module_fn-reproduce.._match"></a>
### fn-reproduce~_match(fns, [childArgOffset], [matchValue], [nonMatchValue]) ⇒ <code>Object</code>
Singular verison of `.match()`

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Returns**: <code>Object</code> - {fnName: [function]}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fns | <code>Object</code> |  | The object with two functions. |
| [childArgOffset] | <code>Number</code> | <code>0</code> | The number offset of parent arguments passed to child. |
| [matchValue] |  |  | Value to match result of parent promise. |
| [nonMatchValue] |  |  | Value to return if match is not made. |

<a name="module_fn-reproduce.._prependArgs"></a>
### fn-reproduce~_prependArgs(fns, [childArgOffset]) ⇒ <code>Object</code>
Singular verison of `.prependArgs()`

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Returns**: <code>Object</code> - {fnName: [function]}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fns | <code>Object</code> |  | The object with two functions. |
| [childArgOffset] | <code>Number</code> | <code>0</code> | The number offset of parent arguments passed to child. |

<a name="module_fn-reproduce.._buildFn"></a>
### fn-reproduce~_buildFn(obj, parentName, childName) ⇒ <code>Object</code>
Singular version of `buildFn`

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Returns**: <code>Object</code> - fns {parent: [function], child: [function]}  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object of functions. |
| parentName | <code>String</code> | Parent function name. |
| childName | <code>String</code> | Child function name. |

<a name="module_fn-reproduce..buildFn"></a>
### fn-reproduce~buildFn(obj, parentName(s), childrenName(s)) ⇒ <code>Object</code>
Builds an object of functions based on the object and array or string properties provided.

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Returns**: <code>Object</code> - fnsArr [{parent: [function], child: [function]}]  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object of functions. |
| parentName(s) | <code>String</code> &#124; <code>Array</code> | The array or string of parent function name(s). |
| childrenName(s) | <code>String</code> &#124; <code>Array</code> | The array or string of children function name(s). |

<a name="module_fn-reproduce..prependArgs"></a>
### fn-reproduce~prependArgs(fns|fnsArr, [childArgOffset]) ⇒ <code>Object</code>
Takes an object of two functions and merge them together creating a third.
The result of the parent function is prepended to the arguments for the child.

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Summary**: Takes two functions creates third that unshift the parent result into child args.  
**Returns**: <code>Object</code> - {fnName: [function]} - Object with one or multiple function methods.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fns|fnsArr | <code>Object</code> &#124; <code>Array</code> |  | Either array of fns, or fns. |
| [childArgOffset] | <code>Number</code> | <code>0</code> | The number offset of parent arguments passed to child. |

<a name="module_fn-reproduce..match"></a>
### fn-reproduce~match(fns, [childArgOffset], [matchValue], [nonMatchValue]) ⇒ <code>Object</code>
Takes an object of two functions and merge them together creating a third.
If the result of the parent function is equal to the `matchValue` argument
the child function fires, else the `nonMatchValue` is returned.

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Summary**: Takes two functions creates third that fires based on value of parent.  
**Returns**: <code>Object</code> - {fnName: [function]} - Object with one or multiple function methods.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fns | <code>Object</code> |  | The object with two functions. |
| [childArgOffset] | <code>Number</code> | <code>0</code> | The number offset of parent arguments passed to child. |
| [matchValue] | <code>String</code> &#124; <code>Boolean</code> &#124; <code>Number</code> |  | Value to match result of parent promise. |
| [nonMatchValue] | <code>String</code> &#124; <code>Boolean</code> &#124; <code>Number</code> |  | Value to return if match is not made. |

<a name="module_fn-reproduce..buildFnMatch"></a>
### fn-reproduce~buildFnMatch(obj, parentName(s), childrenName(s), [childArgOffset], [matchValue], [nonMatchValue]) ⇒ <code>Object</code>
Shorthand for running buildFn() & match().

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Returns**: <code>Object</code> - {fnName: [function]} - Object with one or multiple function methods.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>Object</code> |  | The object of functions. |
| parentName(s) | <code>String</code> &#124; <code>Array</code> |  | The array or string of parent function name(s). |
| childrenName(s) | <code>String</code> &#124; <code>Array</code> |  | The array or string of children function name(s). |
| [childArgOffset] | <code>Number</code> | <code>0</code> | The number offset of parent arguments passed to child. |
| [matchValue] | <code>String</code> &#124; <code>Boolean</code> &#124; <code>Number</code> |  | Value to match result of parent promise. |
| [nonMatchValue] | <code>String</code> &#124; <code>Boolean</code> &#124; <code>Number</code> |  | Value to return if match is not made. |

<a name="module_fn-reproduce..buildFnPrependArgs"></a>
### fn-reproduce~buildFnPrependArgs(obj, parentName(s), childrenName(s), [childArgOffset]) ⇒ <code>Object</code>
Shorthand for running buildFn() & prependArgs().

**Kind**: inner method of <code>[fn-reproduce](#module_fn-reproduce)</code>  
**Returns**: <code>Object</code> - {fnName: [function]} - Object with one or multiple function methods.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>Object</code> |  | The object of functions. |
| parentName(s) | <code>String</code> &#124; <code>Array</code> |  | The array or string of parent function name(s). |
| childrenName(s) | <code>String</code> &#124; <code>Array</code> |  | The array or string of children function name(s). |
| [childArgOffset] | <code>Number</code> | <code>0</code> | The number offset of parent arguments passed to child. |

<a name="module_fn-with-name-prop"></a>
## fn-with-name-prop ⇒ <code>function</code>
`npm install fn-with-name-prop --save`

**Summary**: Adds &#x60;_name&#x60; property to function  
**Returns**: <code>function</code> - { [function] _name: fnName} - Function with name prop.  
**Throws**:

- <code>Error</code> no name found or provided
- <code>Error</code> no function found or provided


| Param | Type | Description |
| --- | --- | --- |
| [fn] | <code>function</code> | The function you want to assign / get a name of. |
| [fnName] | <code>String</code> | The function name override. |
| [objFns] | <code>Object</code> | Object method or methods. |

**Example**  
```js
// with single object method
var fn = fnSetName({hello: function(){}})
expect(fn).to.be.instanceof(Function)
expect(fn).to.have.property("_name", "hello")
```
**Example**  
```js
// with anon function
var fn = fnSetName(function(){}, "hello")
expect(fn).to.be.instanceof(Function)
expect(fn).to.have.property("_name", "hello")
```
**Example**  
```js
// with named function
var fn = fnSetName(function hello(){})
expect(fn).to.be.instanceof(Function)
expect(fn).to.have.property("_name", "hello")
```
**Example**  
```js
// with assigned named function
var lib = function hello(){}
var fn = fnSetName(lib)
expect(fn).to.be.instanceof(Function)
expect(fn).to.have.property("_name", "hello")
```
**Example**  
```js
// with object method
var lib = {}
lib.hello = function(){}
var fn = fnSetName("hello", lib)
expect(fn).to.be.instanceof(Function)
expect(fn).to.have.property("_name", "hello")
```
**Example**  
```js
// with named object method
var lib = {}
lib.hello = function hello(){}
var fn = fnSetName("hello", lib)
expect(fn).to.be.instanceof(Function)
expect(fn).to.have.property("_name", "hello")
```
<a name="arrCamelize"></a>
## arrCamelize(arr) ⇒ <code>String</code>
Joins array and camel cases each word

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | An array of strings |

<a name="arrExtend"></a>
## arrExtend(arr) ⇒ <code>Object</code>
Builds an object from an array of objects.
Orignated in this Stackoverflow post ["Convert array of objects to just one object"](http://stackoverflow.com/questions/20103565/convert-array-of-objects-to-just-one-object).

**Kind**: global function  
**Returns**: <code>Object</code> - An object where each item in the array is a property and value.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | An array containing objects. |

<a name="arrExtract"></a>
## arrExtract(arr, recursiveProperty) ⇒ <code>Array</code>
Flatten a array-object via recursive property

**Kind**: global function  
**Returns**: <code>Array</code> - Flat array of all recursive properties without recursive property  
**See**: [http://stackoverflow.com/questions/31829897/convert-recursive-array-object-to-flat-array-object](http://stackoverflow.com/questions/31829897/convert-recursive-array-object-to-flat-array-object)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | Array of objects with recursive props |
| recursiveProperty | <code>String</code> | The string of the recursive property |

<a name="assimilate"></a>
## assimilate()
turn the contents of array or object into sorted string

**Kind**: global function  
<a name="fauxProject"></a>
## fauxProject()
creates a dummy project in the current directory

**Kind**: global function  

* [fauxProject()](#fauxProject)
  * [.modules()](#fauxProject.modules)
  * [.package()](#fauxProject.package)
  * [.deps()](#fauxProject.deps)
  * [.module()](#fauxProject.module)

<a name="fauxProject.modules"></a>
### fauxProject.modules()
creates fake modules

**Kind**: static method of <code>[fauxProject](#fauxProject)</code>  
<a name="fauxProject.package"></a>
### fauxProject.package()
creates a dummy package object using deps and devDeps

**Kind**: static method of <code>[fauxProject](#fauxProject)</code>  
<a name="fauxProject.deps"></a>
### fauxProject.deps()
inflates array into object using dummy value

**Kind**: static method of <code>[fauxProject](#fauxProject)</code>  
<a name="fauxProject.module"></a>
### fauxProject.module()
creates a module

**Kind**: static method of <code>[fauxProject](#fauxProject)</code>  
<a name="fnThrow"></a>
## fnThrow()
Returns a function that throws an error.

**Kind**: global function  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| errorObject | <code>function</code> | An Error Object. |
| errorInstance | <code>Object</code> | An instance of an error Object. |
| message | <code>String</code> | A string message for the error. |

<a name="fnToMethod"></a>
## fnToMethod([fn], [fnName], [objFns]) ⇒ <code>Object</code>
Way of standardizing and naming a function.

**Kind**: global function  
**Returns**: <code>Object</code> - {fnName: [function]}  
**Throws**:

- <code>Error</code> no name found or provided


| Param | Type | Description |
| --- | --- | --- |
| [fn] | <code>function</code> | The function you want to assign / get a name of. |
| [fnName] | <code>String</code> | The function name override. |
| [objFns] | <code>Object</code> | The object that contains function property `fnName`. |

**Example**  
```js
_.mixin(fnToMethod(require('join-camel-case')))
```
**Example**  
```js
var anon = {}
anon.ifHappy = function(str){
  if (str == 'happy') return true
  return false
}
fnToMethod('ifHappy', anon) // => {'ifHappy': [function]}
```
**Example**  
```js
var anon = {}
anon.ifHappy = function(str){
  if (str == 'happy') return true
  return false
}
fnToMethod(anon.ifHappy) // throws
```
**Example**  
```js
// returns {'ifHappy': [function]}
var known = {}
known.ifHappy = function ifHappy(str){
  if (str == 'happy') return true
  return false
}
fnToMethod(known.ifHappy) // => {'ifHappy': [function]}
```
**Example**  
```js
function ifHappy(str){
  if (str == 'happy') return true
  return false
}
fnToMethod(ifHappy) // => {'ifHappy': [function]}
```
**Example**  
```js
var ifHappy = function(str){
  if (str == 'happy') return true
  return false
}
fnToMethod('ifHappy', ifHappy) // => {'ifHappy': [function]}
```
<a name="fsExists"></a>
## fsExists(thePath) ⇒ <code>Boolean</code>
Checks if a path exists on the file System

**Kind**: global function  
**Returns**: <code>Boolean</code> - True if exists, false if doesn't exist  

| Param | Type | Description |
| --- | --- | --- |
| thePath | <code>String</code> | Path of file |

<a name="fsStats"></a>
## fsStats(stats) ⇒ <code>String</code>
Given stats from fs.lstat or fs.stat will return type

**Kind**: global function  

| Param | Type |
| --- | --- |
| stats | <code>Object</code> | 

