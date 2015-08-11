# Picking Properties

I'm finding myself converting objects into arguments with `_.values` however if the args don't line up because the object properties aren't sorted this can be catastrophic. The `lodash` `_.pick` function seems to do the trick by retrieving the properties of an object in order.

```javascript
var _ = require('lodash')
var assert = require('assert')
```

```javascript
var object = {
  "foo": "alpha",
  "baz": "gamma",
  "bar": "beta",
}

var correctOrder = [
  'foo',
  'bar',
  'baz'
]
var val = _.pick(object, correctOrder)
assert.equal(correctOrder.join(), _.keys(val).join())
```


```javascript
var object = {
  "baz": "gamma",
  "foo": "alpha",
  "bar": "beta",
}

var correctOrder = [
  'foo',
  'bar',
  'baz'
]
var val = _.pick(object, correctOrder)
assert.equal(correctOrder.join(), _.keys(val).join())
```

Another problem I'm interested in is if when you extend an object does it change the order of the existing properties?

```javascript
var object = {
  "foo": "alpha",
  "bar": "beta",
  "baz": "gamma"
}
var correctOrder = [
  'foo',
  'bar',
  'baz'
]
var extended = {
  "bar": "delta",
}
_.extend(object, extended)
assert.equal(correctOrder.join(), _.keys(object).join())
```

It seems like it works.

<!-- START doctoc -->
<!-- END doctoc -->
