# test-markdown

I wanted a way of writing unit tests in markdown. I've been playing around with things like `[yamadapc/jsdoctest](https://github.com/yamadapc/jsdoctest)` which parses `JSDoc` declarations looking for `@example` keywords in source code and creates a test based on them. I took this one step further and just wanted to be able two ensure that the javascript I write within markdown is valid.

```javascript
var assert = require('assert')
var helloWorld = 'foo'
assert.equal(helloWorld, 'foo')
```

If you run this file using `test-markdown` it will exit with a status code of `0`, meaning no exceptions where thrown.

This overall provides a different way of sharing and explaining code, because it's much more formal then a complicated test file.

Try it yourself by executing the command:

```bash
./bin/test-markdown ./wrtiting/test-markdown.md
```

* Todo:
  * run [`standard`.lintText](https://github.com/feross/standard#standardlinttexttext-opts-callback) on the javascript within a md file
