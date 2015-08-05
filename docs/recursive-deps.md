<a name="recursiveDeps"></a>
## recursiveDeps(srcpath, [localRegex], [acornParseOptions], [umdOptions], [natives]) ⇒ <code>Object</code>
Goes through Javascript file for file dependenceies.

**Kind**: global function  
**Returns**: <code>Object</code> - {"native": [], "local": [], "npm": []}  

| Param | Type | Description |
| --- | --- | --- |
| srcpath | <code>String</code> | The path of the Javascript file. |
| [localRegex] | <code>RegExp</code> | The regex to base local module discovery after. |
| [acornParseOptions] | <code>Object</code> | [Supply options to acorn](https://github.com/marijnh/acorn#main-parser) |
| [umdOptions] | <code>Object</code> | [Supply options to acorn-umr](https://github.com/megawac/acorn-umd) |
| [natives] | <code>Array</code> | An array of native node modules |


* [recursiveDeps(srcpath, [localRegex], [acornParseOptions], [umdOptions], [natives])](#recursiveDeps) ⇒ <code>Object</code>
  * [.localRegex](#recursiveDeps.localRegex) : <code>RegExp</code>
  * [.parseSrc(src, [acornParseOptions], [umdOptions])](#recursiveDeps.parseSrc) ⇒ <code>Array</code>
  * [.localDeps(deps, [localRegex])](#recursiveDeps.localDeps) ⇒ <code>Array</code>
  * [.recurse(deps, srcpath, [localRegex])](#recursiveDeps.recurse) ⇒ <code>Array</code>
  * [.parseFile(srcpath, [localRegex], [acornParseOptions], [umdOptions])](#recursiveDeps.parseFile) ⇒ <code>Array</code>
  * [.byType(deps, [localRegex], [natives])](#recursiveDeps.byType) ⇒ <code>Object</code>
  * [.getValues(sortedDeps)](#recursiveDeps.getValues) ⇒ <code>Object</code>

<a name="recursiveDeps.localRegex"></a>
### recursiveDeps.localRegex : <code>RegExp</code>
The defaut regex to detect local modules.

**Kind**: static property of <code>[recursiveDeps](#recursiveDeps)</code>  
<a name="recursiveDeps.parseSrc"></a>
### recursiveDeps.parseSrc(src, [acornParseOptions], [umdOptions]) ⇒ <code>Array</code>
[parseSrc description]

**Kind**: static method of <code>[recursiveDeps](#recursiveDeps)</code>  
**Returns**: <code>Array</code> - An array object of module defination(s).  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> | The string contents of a Javascript file. |
| [acornParseOptions] | <code>Object</code> | [Supply options to acorn](https://github.com/marijnh/acorn#main-parser) |
| [umdOptions] | <code>Object</code> | [Supply options to acorn-umr](https://github.com/megawac/acorn-umd) |

<a name="recursiveDeps.localDeps"></a>
### recursiveDeps.localDeps(deps, [localRegex]) ⇒ <code>Array</code>
Maps and filters out the deps array object for local deps.

**Kind**: static method of <code>[recursiveDeps](#recursiveDeps)</code>  
**Returns**: <code>Array</code> - An array of local deps.  

| Param | Type | Description |
| --- | --- | --- |
| deps | <code>Array</code> | An array object of module defination(s). |
| [localRegex] | <code>RegExp</code> | The regex to base local module discovery after. |

<a name="recursiveDeps.recurse"></a>
### recursiveDeps.recurse(deps, srcpath, [localRegex]) ⇒ <code>Array</code>
Loops over the array of deps recursively.

**Kind**: static method of <code>[recursiveDeps](#recursiveDeps)</code>  
**Returns**: <code>Array</code> - An array object of module defination(s).  

| Param | Type | Description |
| --- | --- | --- |
| deps | <code>Array</code> | An array object of module defination(s). |
| srcpath | <code>String</code> | The string contents of a Javascript file. |
| [localRegex] | <code>RegExp</code> | The regex to base local module discovery after. |

<a name="recursiveDeps.parseFile"></a>
### recursiveDeps.parseFile(srcpath, [localRegex], [acornParseOptions], [umdOptions]) ⇒ <code>Array</code>
Takes a file and fetches all deps

**Kind**: static method of <code>[recursiveDeps](#recursiveDeps)</code>  
**Returns**: <code>Array</code> - An array object of module defination(s).  

| Param | Type | Description |
| --- | --- | --- |
| srcpath | <code>String</code> | The path of the Javascript file. |
| [localRegex] | <code>RegExp</code> | The regex to base local module discovery after. |
| [acornParseOptions] | <code>Object</code> | [Supply options to acorn](https://github.com/marijnh/acorn#main-parser) |
| [umdOptions] | <code>Object</code> | [Supply options to acorn-umr](https://github.com/megawac/acorn-umd) |

<a name="recursiveDeps.byType"></a>
### recursiveDeps.byType(deps, [localRegex], [natives]) ⇒ <code>Object</code>
Organizes module dependenceies by type `local`, `npm`, and `native`.

**Kind**: static method of <code>[recursiveDeps](#recursiveDeps)</code>  
**Returns**: <code>Object</code> - Returns array of sorted module object definitions.  

| Param | Type | Description |
| --- | --- | --- |
| deps | <code>Array</code> | An array object of module defination(s). |
| [localRegex] | <code>RegExp</code> | The regex to base local module discovery after. |
| [natives] | <code>Array</code> | An array of native node modules |

<a name="recursiveDeps.getValues"></a>
### recursiveDeps.getValues(sortedDeps) ⇒ <code>Object</code>
Organizes module dependenceies by type `local`, `npm`, and `native`.

**Kind**: static method of <code>[recursiveDeps](#recursiveDeps)</code>  
**Returns**: <code>Object</code> - Returns array of sorted module object definitions containing strings.  

| Param | Type | Description |
| --- | --- | --- |
| sortedDeps | <code>Object</code> | A sotrted object of module defination(s). |

