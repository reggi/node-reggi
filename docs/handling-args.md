# Handling Arguments

I'm gonna use `lodash` and the Node.js native `assert` library going forward so you'll need it as a dependency.

```javascript
var _ = require('lodash')
var assert = require('assert')
```

Here we define a function `executable` and within it we turn it's arguments into an object.

```javascript
function executable (foo, bar) {
  var args = _.zipObject(['foo', 'bar'], _.values(arguments))
  return args
}
var val = executable('alpha', 'beta')
assert.deepEqual(val, {'foo': 'alpha', 'bar': 'beta'})
```

Here we do the reverse, we pass the object foo into the function.

```javascript
var foo = {'foo': 'alpha'}
var val = executable.apply(null, _.values(foo))
assert.deepEqual(val, {'foo': 'alpha', 'bar': undefined})
```

The problem with this is when we pass the arguments they aren't sorted. Another problem is that because were passing not passing in `foo.bar` that property is undefined, when in reality we want it to be `null` (as unset arguments are).

```javascript
var foo = {'bar': 'beta'}
var val = executable.apply(null, _.values(foo))
assert.deepEqual(val, {'foo': 'beta', 'bar': undefined})
```

As you can see above because there's only one prop, and it's not `foo`. The wrong parameter gets passed to the function.

My solution to this problem is providing some convenience functions to remedy this.


```javascript
var arra
var foo = {'bar': 'beta'}
var val = executable.apply(null, _.values(foo))
assert.deepEqual(val, {'foo': 'beta', 'bar': undefined})
```

<!-- START doctoc -->
<!-- END doctoc -->
