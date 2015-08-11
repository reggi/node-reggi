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
