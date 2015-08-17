

```js
// prevent eval
var assert = require('assert')
var x = 'foo'
assert.equal(x, 'foo')
console.log(x + " from //prevent eval")
```

```js
var assert = require('assert')
var x = 'bar'
assert.equal(x, 'bar')
console.log(x)
```

[](#preventEval)
```js
var assert = require('assert')
var x = 'baz'
assert.equal(x, 'baz')
console.log(x + " [](#preventEval)")
```
