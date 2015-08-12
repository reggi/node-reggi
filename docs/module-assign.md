# Module Assign

[![Build Status](https://travis-ci.org/reggi/module-harvest.svg?branch=master)](https://travis-ci.org/reggi/module-assign) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Assign a local javascript file to a module of it's very own. Have you ever wanted to `require()` a file absolutely as a module, but without installing or linking it? This program has you covered.

```
npm install module-assign -g
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Why](#why)
- [Example](#example)
  - [The Setup](#the-setup)
  - [The Result](#the-result)
  - [Assign Modules in `localDependencies`](#assign-modules-in-localdependencies)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

## Example

### The Setup

Here's a directory structure.

```
.
├── alpha.js
├── beta.js
├── node_modules
└── package.json
```

The contents of `alpha.js` are the following:

```javascript
module.exports = 'this is alpha'
```

The contents of `beta.js` are the following:

[](#preventeval)
```javascript
var alpha = require('alpha')
console.log(alpha)
```

You can see that the call to alpha is `alpha` and not `./alpha.js`, which will thrown an error because no `alpha` module exists.

The contents of `packge.json` are the following:

```json
{
  "name": "test",
  "version": "1.0.0"
}
```

### The Result

The `module-assign` is run with the `./alpha.js` file as an argument.

```bash
module-assign ./alpha.js
```

The directory now looks like this.

```
.
├── alpha.js
├── beta.js
├── node_modules
│   └── alpha
│       └── package.json
└── package.json
```

You can see `node_modules`, `node_modules/alpha`, `node_modules/alpha/package.json`, have all been created.

The contents of `node_modules/alpha/package.json` look like this:

```json
{
  "name": "alpha",
  "main": "../../alpha.js",
  "assignedModule": true
}
```

The contents of `package.json` are also changed.

```json
{
  "name": "test",
  "version": "1.0.0",
  "localDependencies": {
    "alpha": "./alpha.js"
  }
}
```

You can see that `localDependencies` was added with `alpha` as a property.

### Assign Modules in `localDependencies`

Let's say you want to assign all the modules in `localDependencies` at once. Sort of link `npm install` does. Use the command command with the `--install` flag.

```bash
module-assign --install
```

Let's say you want to deploy code that uses `localDependencies`. Now you can have a hook in your `scripts` that runs `module-assign --install` and will assign all the deps so the code runs as expected.
