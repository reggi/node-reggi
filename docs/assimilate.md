# assimilate

The assimilate function is does something very interesting, it takes an argument and converts it into one long sorted string of all it's characters.

```javascript
var assert = require('assert')
var assimilate = require('./assimilate')
```

Here you can see it works on arrays.

```javascript
var a = ['foo', 'bar']
var b = ['bar', 'foo']
assert.equal(assimilate(a), assimilate(b))
```

Here you can see it works on collections.

```javascript
var a = [{'foo': 'foo'}, {'bar': 'bar'}]
var b = [{'bar': 'bar'}, {'foo': 'foo'}]
assert.equal(assimilate(a), assimilate(b))
```

Here you can see it works on objects.

```javascript
var a = {'foo': 'foo', 'bar': 'bar'}
var b = {'bar': 'bar', 'foo': 'foo'}
assert.equal(assimilate(a), assimilate(b))
```

For a little more in-depth look, check this out.

```javascript
var a = "cats"
var b = "satc"
assert.equal(assimilate(a), assimilate(b))
```

This assert passes too!

Let's see if numbers pass as well!

```javascript
var a = 1
var b = 1
assert.equal(assimilate(a), assimilate(b))
```

Yup!

<!-- START doctoc -->
<!-- END doctoc -->
