# `evalmd` File Eval

The `fileEval` declaration allows you to define a code block as a file. There are two different ways of declaring a code block. One is to use an `anchor` tag with the `href` set to `#fileEval`. Here's an example:

    This is the file [./alpha.js](#fileEval).

    ```js
    module.exports = 'alpha-path'
    ```

When adding a `fileEval` declaration in this way the name of the file is the `text` content of the anchor. Another way to declare a block as a file is using a comment. Here's an example:

    ```js
    // fileEval ./alpha.js
    module.exports = 'alpha-path'
    ```

When the first line of a code block is a comment with the word `fileEval` in front the string after will be interpreted as the file.

> Note. If any of the code blocks in a file contain a `fileEval` declaration then the entire file will be run as `blockScope`.

> Note. The match patterns for `file eval` and `fileEval` are case-insensitive. So `fILeEvAl` works just as well.

## Examples

In the following set of examples I use `./alpha.js`, `alpha.js`, and `alpha` as all different and distinct files.

### Definitions with path

This is the file [./alpha.js](#fileEval).

```js
module.exports = 'alpha-path'
```

This is the file [./beta.js](#fileEval).

```js
module.exports = 'beta-path'
```

This is the file [./gamma.js](#fileEval).

```js
module.exports = 'gamma-path'
```

This is the code that uses each file.

```js
var assert = require('assert')
var alpha = require('./alpha.js')
var beta = require('./beta.js')
var gamma = require('./gamma.js')
assert.deepEqual([alpha, beta, gamma], ['alpha-path', 'beta-path', 'gamma-path'])
```

### Definitions as module with extension

This is the file [alpha.js](#fileEval).

```js
module.exports = 'alpha-pathless'
```

This is the file [beta.js](#fileEval).

```js
module.exports = 'beta-pathless'
```

This is the file [gamma.js](#fileEval).

```js
module.exports = 'gamma-pathless'
```

This is the code that uses each file.

```js
var assert = require('assert')
var alpha = require('alpha.js')
var beta = require('beta.js')
var gamma = require('gamma.js')
assert.deepEqual([alpha, beta, gamma], ['alpha-pathless', 'beta-pathless', 'gamma-pathless'])
```

### Definitions as module

This is the file [alpha](#fileEval).

```js
module.exports = 'alpha'
```

This is the file [beta](#fileEval).

```js
module.exports = 'beta'
```

This is the file [gamma](#fileEval).

```js
module.exports = 'gamma'
```

This is the code that uses each file.

```js
var assert = require('assert')
var alpha = require('alpha')
var beta = require('beta')
var gamma = require('gamma')
assert.deepEqual([alpha, beta, gamma], ['alpha', 'beta', 'gamma'])
```
