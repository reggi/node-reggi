# `evalmd` Self Module Insertion

When adding a `require` statement that matches the `name` within the `package.json` file in the `cwd` (current working directory), the module string of the module will be replaced with the `main` property within the `package.json` file.

```javascript
var assert = require('assert')
var evalMarkdown = require('./eval-markdown.js')
assert.equal(typeof evalMarkdown === 'function', true)
```

```javascript
var assert = require('assert')
var evalMarkdown = require('evalmd') // set to './eval-markdown.js'
assert.equal(typeof evalMarkdown === 'function', true)
```
