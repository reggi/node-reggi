# `evalmd` Self Require

[./hello-world.js](#file)
```js
var hello = 'foo bar'
module.exports = hello
```

```js
var assert = require('assert')
var hello = require('./hello')
assert.equal(hello, 'foo bar')
```
