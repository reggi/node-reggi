```js
var assert = require('assert')
var tabbedVar = 'hello	'
var hasTab = Boolean(tabbedVar.match('\t'))
assert.equal(hasTab, true)
```
