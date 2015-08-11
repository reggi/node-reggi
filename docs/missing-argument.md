# Missing argument

Curious to find out what the default value is for when an argument isn't passed into a function.

```javascript
var assert = require('assert')
function fn(foo, bar){
  assert.equal(foo === undefined, true)
  assert.equal(bar === undefined, true)
}
fn()
```

```javascript
var assert = require('assert')
function fn(foo, bar){
  assert.equal(foo === null, false)
  assert.equal(bar === null, false)
}
fn()
```

```javascript
var assert = require('assert')
function fn(foo, bar){
  assert.equal(foo === false, false)
  assert.equal(bar === false, false)
}
fn()
```

It seems that the value for an argument when it's missing is `undefined`.

<!-- START doctoc -->
<!-- END doctoc -->
