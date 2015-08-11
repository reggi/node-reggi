# `module-link`

```
npm install module-link -g
```

## Usage

```
module-link ./lib/path/file.js
module-link ./lib/path/file.js file-lib
```

### How

Here's the rundown, when you run command above the following happens.

1. creates module folder `node_modules/<name>`
2. creates a `package.json` with name and main  

### Why?

Have you ever wanted to require a file absolutely as a module?

```
var fileLibrary = require("file-library")
```

Instead of relatively like this.

```
var fileLibrary = require("./lib/path/file.js")
```

### Notes

* This was a precursor to [`module-harvest`](https://github.com/reggi/module-harvest).
* The original version included a symlink, which isn't necessary, you can link to the file from outside the module.
