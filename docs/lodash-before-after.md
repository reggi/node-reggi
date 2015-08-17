# Lodash Before & After

Here's what we need to get started. Each code block is going to use these common pieces so I'm gonna save them up here. `before` is the spagetti (bad) code, `after` is the cleaner code. Both functions need to do the same thing, by returing the same value `output`.

```js
var assert = require('assert')
var _ = require('lodash')
var before, after, output
```

## Map Over Array of Possible Substrings

I [asked this one over](https://gitter.im/lodash/lodash?at=55ce2ca19b45e15c42643c06) on the `lodash` gitter channel, and [__@hneiva__](https://github.com/hneiva) gave me this great code.

```js
var hashes, lines

var hashes = [
  '2e7557a4db088b14bc6148bf3acab0f4b85b8b2eb6064d2000c4aac6041d8646',
  '48bf5b03d9defa965bfd844a4458a1b36543eb9f1ca40d71ca664be7ac2bd0d4',
  '860ae1fb966c69605d9f749b2ec20f14d17e02f0c69703f547d3ca9ec34fe909'
]

var lines = [
  'foo2e7557a4db088b14bc6148bf3acab0f4b85b8b2eb6064d2000c4aac6041d8646',
  '48bf5b03d9defa965bfd844a4458a1b36543eb9f1ca40d71ca664be7ac2bd0d4',
  '0ea574a407acfdd2c192d49fffb6821527ac092b391bc8c7365e1d093252fadc',
  '860ae1fb966c69605d9f749b2ec20f14d17e02f0c69703f547d3ca9ec34fe909bar'
]

var before = _.map(lines, function (line) {
  var hash = _.chain(hashes)
  .map(function(hash) {
    if (line.match(hash)) return hash
    return false
  }).without(false).value()[0] || false
  if (hash) return hash
  return ''
})

var after = _.map(lines, function (line) {
  var hash = _.find(hashes, function(hash) { return line.match(hash) })
  return hash || ''
})

var output = [
  '2e7557a4db088b14bc6148bf3acab0f4b85b8b2eb6064d2000c4aac6041d8646',
  '48bf5b03d9defa965bfd844a4458a1b36543eb9f1ca40d71ca664be7ac2bd0d4',
  '',
  '860ae1fb966c69605d9f749b2ec20f14d17e02f0c69703f547d3ca9ec34fe909'
]

assert.deepEqual(before, output)
assert.deepEqual(after, output)
```
