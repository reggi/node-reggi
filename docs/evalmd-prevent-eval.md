# `evalmd` Prevent Eval

The `preventEval` declaration allows you to prevent a code block from being evaluated.  There are two different ways of declaring a code block. One is to use an `anchor`. Here's an example:

    [](#preventEval)
    ```js
    module.exports = 'alpha-path'
    ```

When adding a `preventEval` declaration in this way the name of the file is the `text` content of the anchor. Another way to declare a block as a file is using a comment. Here's an example:

    ```js
    // preventEval
    module.exports = 'alpha-path'
    ```

When the first line of a code block is a comment with the word `preventEval` in front the string after will be interpreted as the file.

> Note. The match patterns for `prevent eval` and `preventEval` are case-insensitive. So `pReVenTeVaL` works just as well.

## Examples

### Evaluated Blocks

```javascript
```

```javascript

```

```javascript
// hello
```

```javascript
// hello

```

```javascript
// hello
//
```

```javascript
var assert = require('assert')
```

```javascript
var x = false
assert.equal(x, false)
```

```javascript
var x = true
assert.equal(x, true)
```

```javascript
var x = true
assert.equal(x, true)
```

### Blocks prevented with anchor

[](#prevent eval)
```js
```

[](#prevent eval)
```javascript

```

[](#prevent eval)
```javascript
// hello
```

[](#prevent eval)
```javascript
// hello

```

[](#prevent eval)
```javascript
// hello
//
```

[](#prevent eval)
```javascript
var assert = require('assert')
```

[](#prevent eval)
```javascript
var x = false
assert.equal(x, false)
```

[](#prevent eval)
```javascript
var x = true
assert.equal(x, true)
```

[](#preventeval)
```javascript
```

[](#preventeval)
```javascript

```

[](#preventeval)
```javascript
// hello
```

[](#preventeval)
```javascript
// hello

```

[](#preventeval)
```javascript
// hello
//
```

[](#preventeval)
```javascript
var assert = require('assert')
```

[](#preventeval)
```javascript
var x = false
assert.equal(x, false)
```

[](#preventeval)
```javascript
var x = true
assert.equal(x, true)
```

### Blocks prevents with comment

```javascript
// prevent eval
```

```javascript
// prevent eval

```

```javascript
// prevent eval
// hello
```

```javascript
// prevent eval
// hello

```

```javascript
// prevent eval
// hello
//
```

```javascript
// prevent eval
var assert = require('assert')
```

```javascript
// prevent eval
var x = false
assert.equal(x, false)
```

```javascript
// prevent eval
var x = true
assert.equal(x, true)
```

```javascript
// preventEval
```

```javascript
// preventEval

```

```javascript
// preventEval
// hello
```

```javascript
// preventEval
// hello

```

```javascript
// preventEval
// hello
//
```

```javascript
// preventEval
var assert = require('assert')
```

### Valid block

```javascript
assert.equal(true, true)
```
