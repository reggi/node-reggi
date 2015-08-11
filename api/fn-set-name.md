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
