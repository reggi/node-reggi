# Module Harvesting

> Note: This is very experimental and the release that is in `reggi/node-reggi` (and `reggi/node-module-harvest`) are both a bit behind what I've been working on.

I just invented something I've dubbed `module harvesting`. It's a method of automated Node.js module creation. What does that mean?

Do you ever find yourself creating a project and needing to use functions you've already built in other projects? If the functions are a couple of lines long you can find yourself copying and pasting them in your project every time you use them. Why didn't you put it on NPM the first time? We're told that monolithic apps are bad, but they need to take shape that way, then down the road your supposed to refactor. I absolutely hate this paradigm. The reason you didn't put it that three line function on `npm` the first time is because there's way to much overhead in creating the repo, publishing, documentation, tests, and setting dependencies. Module Harvesting is here to help.

Here's a great quote from [`substack`](http://substack.net/how_I_write_modules).

> If some component is reusable enough to be a module then the maintenance gains are really worth the overhead of making a new project with separate tests and docs. Splitting out a reusable component might take 5 or 10 minutes to set up all the package overhead but it's much easier to test and document a piece that is completely separate from a larger project. When something is easy, you do it more often.

The question I wanted to address was "What if there was no overhead?".

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [The nitty gritty](#the-nitty-gritty)
- [The Settings](#the-settings)
- [harvest.config.js](#harvestconfigjs)
- [harvest.secret.json](#harvestsecretjson)
- [Life After the Initial Build](#life-after-the-initial-build)
  - [Maintaining File State](#maintaining-file-state)
  - [Maintaining Multiple Git Repos with `gitslave`](#maintaining-multiple-git-repos-with-gitslave)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The nitty gritty

A file is provided to the terminal command for instance, the following code is what I used to harvest `module-harvest` itself.

```bash
module-harvest ./module-harvest.js
```

This code does a myriad of things. Here's the rundown of the most important.

* Creates a `local_modules` directory in the root folder.
* Creates a new module dir `local_modules/module-harvest`
* Tracks down related files (ex. `README.md`, `LICENCE`, `.gitignore`) that might exist and hard links them (`ln`) to the new
* Tracks down related local javascript files (ex. `./module-harvest.js`, `./bin/module-harvest.js`)
* Recursively tracks down local javascript file(s) that are used
* Recursively tracks down all related test javascript files (ex. `./tests/module-harvest.js`)
* Optionally will create a new github repo with the name `module-harvest`
* Optionally will commit `init` code to the new repo

At the end of which I have a folder that looks like this

```bash
thomas@workstation:local_modules$ tree -I node_modules
.
└── module-harvest
    ├── arr-extract.js
    ├── assimilate.js
    ├── bin
    │   └── module-harvest.js
    ├── faux-project.js
    ├── github-create-repo.js
    ├── module-harvest.js
    ├── package-deps.js
    ├── package.json
    ├── promise-props-series.js
    ├── readme.md
    ├── recursive-deps.js
    ├── test
    │   ├── arr-extract.js
    │   ├── data-project-definitions.js
    │   ├── package-deps.js
    │   ├── promise-props-series.js
    │   └── recursive-deps.js
    └── test-chdir-temp.js
```

You can see that it it takes in the file `module-harvest.js` and from there extracts all of it's local deps shown here:

```bash
# root files
bin/module-harvest.js
module-harvest.js
# deps
arr-extract.js
assimilate.js
faux-project.js
github-create-repo.js
package-deps.js
promise-props-series.js
recursive-deps.js
test-chdir-temp.js
```

Then `module-harvest` takes all of these files and checks for test files. And finds these:

```
test/arr-extract.js
test/data-project-definitions.js
test/package-deps.js
test/promise-props-series.js
test/recursive-deps.js
```

## The Settings

`module-harvest`'s settings are completely customizable, however there is a set of `defaults` that, by default you append to, an option to overwrite all the defaults is available as well. Because everyone has such a different way of crafting their node modules I wanted to cake in as much support for versatility as possible (also I change my mind a lot).

Because the options are so complex a `harvest.config.js` file can be used at the root of the project to provied `module-harvest` with arguments.

```
module-harvest - Harvest pieces of npm module from single file.
Usage:
  reggi <file>                      Build module.
  reggi --help | -h                 Shows this help message.
  reggi --version | -v              Show package version.
Options:
  --moduleFile | --file             Javascript file to build into module.
  --moduleName | --name             Name of the module. (default: moduleFile name || jsdoc module def name)
  --moduleDesc | --desc             Description of the module (default: jsdoc module def summary || jsdoc module def desc)
  --packageSrc | --package | --pkg  Path to superproject package.json file
  --localModulesDirName             Path to where local modules will build.
  --directory                       Path to directory (defaults: "./")
  --buildLinks                      Array of src, [src], or [src, dst] hard link definitions, from "./" to `local_module`.
  --trackDeps                       Array of src, [src] javascript definitions, from "./" to `local_module`.
  --trackDevDeps                    Function returning array of src, [src] javascript testdefinitions, from "./" to `local_module`.
  --postBuildReverseLinks           Array of src, [src], or [src, dst] hard link definitions, from `local_module` to "./".
  --githubAccessToken               Github access token
  --githubRepoPrefix                Github repo prefix (ex: "node-")
  --preventMerge                    Boolean option for prevent default merge options.
```

All of which have a `1:1` relationship with the module function.

```
var moduleHarvest = require('./module-harvest')
moduleHarvest(moduleFile, moduleName, moduleDesc, moduleVersion, packageSrc, localModulesDirName, directory, buildLinks, trackDeps, trackDevDeps, postBuildReverseLinks, githubAccessToken, githubRepoPrefix, preventMerge)
```

## harvest.config.js

Here's an example what this might look like in `harvest.config.js`, in fact this is the default. Unless the `preventMerge` argument is true, these options are used. If you add your own optios you append to these. There's no harm in having links to possible files that don't exist.

```javascript
var path = require('path')
module.exports = function (file) {
  return {
    'buildLinks': [
      // src (CWD), destination (./local_modules/<my-module>/)
      ['CONTRIBUTING'],
      ['LICENCE'],
      ['.gitignore-harvest', '.gitignore'],
      ['.npmignore-harvest', '.npmignore'],
      ['docs/' + file.name + '.md', 'README.md'],
      ['docs/general.md', 'README.md'],
      ['.travis.yml'], // backup if specific doesn't exist
      ['packages/package-' + file.name + '.json', 'package.json']
    ],
    'trackDeps': [
      // javascript files can't change name so no array
      file.format,
      path.join('bin', file.format)
    ],
    'trackDevDeps': function (file) {
      // this is a function because devDeps are tracked for
      // each `trackDeps` and all other `required` local modules
      // all possible conventions for test
      return [
        path.join('test', file.format),
        path.join('test', file.format)
      ]
    },
    'postBuildReverseLinks': [
      // src (./local_modules/<my-module>/), destination (CWD)
      ['package.json', 'packages/package-' + file.name + '.json']
    ]
  }
}
```

Note here that `trackDevDeps` is a function not an array. This is because as mentioned earlier a module can have many local file references. The `trackDevDeps` function is run recursively for every local file found in the tree.

> Note: You can also set variables from a static harvest.config.json file.

## harvest.secret.json

If your smart you might have realized that theres a nefarious `githubAccessToken` argument. This can't go in a publicly used place so you can use a `harvest.secret.json` file that looks like this.

```
{
  "githubAccessToken": <github-token
}
```

You'll wanna add `harvest.secret.json` to your `.gitignore` file.

> Note: You can also set variables from a static harvest.secret.json file.

## Life After the Initial Build

### Maintaining File State

Maintaining file state is high priority after the initial build of a module. It's apparent that the hard links alone will not cut it there's gonna need to be a watch script that builds the module(s) whenever a dependency is saved. The problem with that is, without having a map of which local files being used in which project I'd have to build every module, every time something is saved. The map would help a ton, even when a module doesn't yet `require()` it. Because a file that is already connected to a module would need to be updated to include it, at which time `module-harvest` would run and the new file would be added to the map watch list. An expected `--watch` and `-w` flag would be appropriate.

### Maintaining Multiple Git Repos with `gitslave`

`gitslave` is a lovely piece of software that makes it possible to use one superproject like `reggi/node-reggi` and distribute of the packages modules from there. Lets say you change a dependency `./arr-camelize.js` and three of your `local_modules` are using it, because it's linked (and ideally theres a watch script invloved) when it's time to commit the code across all of the four repos (including the superproject) you can commit the change to all the repos using the following command, _note that `gits` is used here instead of `git`_.

```
gits add -A
gits commit -m "updated arr-camelize"
gits push
```
