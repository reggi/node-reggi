# Dependency Object Parsing

Let's include `lodash` and `assert`.

```javascript
var _ = require('lodash')
var assert = require('assert')
```

Here we have an `incoming` obj and an `existing` obj. The intention here is for the `incoming` obj property `arr-camelize` to be overwritten in the `existing` obj.

```javascript
var incoming, existing
incoming = {
  'arr-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize.js',
}
existing = {
  'arr-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize-old.js',
}
_.extend(existing, incoming)
assert.deepEqual(existing, incoming)
```

Here's an example where `incoming` has one extra property `arr-abstract` and you can see that it gets imported over to the `existing` object.

```javascript
incoming = {
  'arr-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize.js',
  'arr-abstract': './arr-abstract.js',
}
existing = {
  'arr-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize-old.js',
}
_.extend(existing, incoming)
assert.deepEqual(existing, incoming)
assert.equal(existing['arr-abstract'], incoming['arr-abstract'])
```

How about something a bit more complicated?

Lets say you want to update `keys` based on a newer `value`. The code below does just that by using the `_.invert` method. It swaps the `keys` and `values` of an object, then when we extend the inverted states we have a pure inverted object.

```javascript
var unchangedExisting, invertIncoming, invertExisting, existingOne, existingTwo
incoming = {
  'arr-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize.js'
}
existing = {
  'arr-old-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize.js',
  'arr-dolphin': './arr-dolphin.js'
}
unchangedExisting = _.clone(existing)
// the operation
// _.extend(existing, incoming)
// console.log(existing)
invertIncoming = _.invert(incoming)
invertExisting = _.invert(existing)
_.extend(invertExisting, invertIncoming)
existingOne = _.invert(invertIncoming)
existingTwo = _.chain(existing)
.pairs()
.filter(function (val) {
  return !_.contains(_.values(existingOne), val[1])
})
.object()
.value()
_.extend(existingOne, existingTwo)
existing = existingOne
// the assertions
assert.equal(existing['arr-manipulator'], './arr-manipulator.js')
assert.equal(existing['arr-old-manipulator'], undefined)
// wanted to show here that it also leaves `arr-camelize` alone
assert.equal(existing['arr-camelize'], incoming['arr-camelize'])
assert.equal(existing['arr-dolphin'], unchangedExisting['arr-dolphin'])
```

However it makes more sense to ditch the `_.invert` calls.

```javascript
var withoutDupes
incoming = {
  'arr-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize.js'
}
existing = {
  'arr-old-manipulator': './arr-manipulator.js',
  'arr-camelize': './arr-camelize.js',
  'arr-dolphin': './arr-dolphin.js'
}
unchangedExisting = _.clone(existing)
// the operation
// _.extend(existing, incoming)
// console.log(existing)
var withoutDupes = _.chain(existing)
.pairs()
.filter(function (val) {
  return !_.contains(_.values(incoming), val[1])
})
.object()
.value()
_.extend(withoutDupes, incoming)
existing = withoutDupes
// the assertions
assert.equal(existing['arr-manipulator'], './arr-manipulator.js')
assert.equal(existing['arr-old-manipulator'], undefined)
// wanted to show here that it also leaves `arr-camelize` alone
assert.equal(existing['arr-camelize'], incoming['arr-camelize'])
assert.equal(existing['arr-dolphin'], unchangedExisting['arr-dolphin'])
```

Here's a demo of how `_.difference` works, which always trips me up.

```javascript
var testOne = _.difference(['alpha'], [''])
var testTwo = _.difference([''], ['alpha'])
assert.deepEqual(testOne, ['alpha'])
assert.deepEqual(testTwo, [''])
```
