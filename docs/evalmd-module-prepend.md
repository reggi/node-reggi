```javascript
var assert = require('assert')
var arrCamelize = require('./arr-camelize.js')
assert.equal(typeof arrCamelize === 'function', true)
```

```javascript
var assert = require('assert')
var arrCamelize = require('reggi') // set to './arr-camelize.js'
assert.equal(typeof arrCamelize === 'function', true)
```
