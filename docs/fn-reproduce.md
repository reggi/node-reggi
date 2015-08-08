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

