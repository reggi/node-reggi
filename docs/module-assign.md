# Module Assign

[![Build Status](https://travis-ci.org/reggi/module-harvest.svg?branch=master)](https://travis-ci.org/reggi/module-assign) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Assign a module name to a local javascript file. Have you ever wanted to `require()` a file absolutely as a module, but without installing or linking it? This program has you covered.

```
npm install module-assign -g
```

## Why

Normally if you wanted to include the local file `/lib/index.js` assuming you're in the root directory you would do this.

```javascript
var moduleAssign = require('./module-assign.js')
```

Note the `..` you'd have to go one directory up. This is how relative linking works. However I sought out to be able to just call this:

```javascript
var moduleAssign = require('module-assign')
```

So I asked myself. How could this be done? First off npm has a [`link` command]. It creates a symlink of a package within your project's `node_modules` folder. However it has one major flaw [it doesn't save references to local files in package.json](https://github.com/npm/npm/issues/1166).

I created [`module-harvest`](https://github.com/reggi/module-harvest) (a different module) to solve the specific problem of partitioning a module out of another project. Which solves this whole linking problem in a different way, it creates the module outright, however the linking problem still existed, so I created this to remedy it.

This project uses the property `localDependencies` within `package.json` to save references to `localDependencies`.

## Usage

Below we run the command and pass in a file and use [`tree`](http://mama.indstate.edu/users/ice/tree/) and [`json`](https://github.com/trentm/json) to view the results of running the command.

```bash
module-assign ./arr-camelize.js
# inspect the newly changes / created files
tree ./node_modules/arr-camelize
# ./node_modules/arr-camelize
# └── package.json
cat ./node_modules/arr-camelize/package.json | json
# {
# "name": "arr-camelize",
# "main": "../../arr-camelize.js",
# "assignedModule": true
# }
cat package.json | json localDependencies.arr-camelize
# ./arr-camelize.js
```

This does the following:

* Adds the directory `arr-camelize` within `node_modules`.
* Creates a module `package.json` with `name` and `main`
* Adds `arr-camelize` to the `localDependencies` obj within `./package.json`

If ran with `DEBUG=*` you can have a more verbose output

```bash
DEBUG=* ./bin/module-assign.js ./arr-camelize.js
#  module-assign file read package.json +0ms
#  module-assign dirs made node_modules/arr-camelize +7ms
#  module-assign file written node_modules/arr-camelize/package.json +4ms
#  module-assign file written ./package.json +11ms
```

### Assign Modules in `localDependencies`

Let's say you want to assign all the modules in `localDependencies` at once. Sort of link `npm install` does. Use the command command with the `--install` flag.

```bash
module-assign --install
```

Let's say you want to deploy code that uses `localDependencies`. Now you can have a hook in your `scripts` that runs `module-assign --install` and will assign all the deps so the code runs as expected.
