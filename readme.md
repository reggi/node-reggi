# Node.js: reggi

[![Build Status](https://travis-ci.org/reggi/node-reggi.svg)](https://travis-ci.org/reggi/node-reggi)

`reggi` is a [`superproject`](http://gitslave.sourceforge.net/) of javascript functions created by Thomas Reggi.

```
npm install reggi --save
```

## Module Harvesting

I just invented something I've dubbed `module harvesting`. It's a method of automated Node.js module creation. What does that mean?

Do you ever find yourself creating a project and needing to use functions you've already built in other projects? If the functions are a couple of lines long you can find yourself copying and pasting them in your project every time you use them. Why didn't you put it on NPM the first time? We're told that monolithic apps are bad, but they need to take shape that way, then down the road your supposed to refactor. I absolutely hate this paradigm. The reason you didn't put it that three line function on `npm` the first time is because there's way to much overhead in creating the repo, publishing, documentation, tests, and setting dependencies. Module Harvesting is here to help.

Here's a great quote from [`substack`](http://substack.net/how_I_write_modules).

> If some component is reusable enough to be a module then the maintenance gains are really worth the overhead of making a new project with separate tests and docs. Splitting out a reusable component might take 5 or 10 minutes to set up all the package overhead but it's much easier to test and document a piece that is completely separate from a larger project. When something is easy, you do it more often.

The question I wanted to address was "What if there was no overhead?".

## Todo (module-harvest)

* run jsdoc2md before harvests
* cake in es6 support
  * if file in root dir is es6 auto bundle dist and src in module
* add `test` and `doc` dirs to possible search
* add support for `lib` dir as `root`, so people can put all their functions in a folder.
  * note if this occurs no modules can be included from outside lib, or else harvesting won't occur correctly.
* harvesting watch script
  * remove unused deps from module
  * add new deps to module
* ? retrieve possible `readme` names from superproject and use that, meaning if `README` exists in `superproject`, that file name will be used to name local_module's `readme`
* Change default for `readme` to `README.md`
* Pull in `LICENCE` file from `superproject`
* Pull in `CONTRIBUTING` file from `superproject`
* Pull in `.gitignore-harvest` file from `superproject` as `.gitignore`
* Generated docs v.s. actual docs
  * If I write a lengthy amount of documentation I don't want to be forced to have to convert it into jsdoc syntax and plop it in my javascript source code. I'd way rather prefer to write it in legit markdown. This means that I'd have two docs, one that I actually write content in and another that is generated, super anoying. [doctoc](https://github.com/thlorenz/doctoc) does something very interesting, it uses a comment block to update a document with content in place, rather then overwriting, or storing multiple pieces of a file, I really like this alternative. If a markdown file exists in `docs` and has that string it will put the `jsdocmd` in that area and not overwrite existing documentation. If it exists and doesn't have the comment block the `jsdocmd` is not placed in, nothing happens, and if the file doesn't exist then the doc is created with `jsdocmd` in it alone (within comment blocks).

## Hard Links vs Copying

This isn't the easiest of choices because there's perks to having both. It's apparent that if the functionality of `module-harvest` would be to output a function

### For Copying

There are two cases I can think of where copying is ideal, and that's when the source code itself is changed. Meaning copying is essential when the local javascript file in the `superproject` needs to be altered in some way before it's placed inside the `local_module`. There are two instances where this might occur.

__Changing source references from `./local-module` to `local-module`__

If I wanted to track down all the references to a local module call and change them to module calls, for instance if the reference `./arr-extend.js` was used and I wanted to convert it to `arr-extend` (if placed on npm), and `reggi/node-arr-extend` (if placed just on github), this would alter the source code programmatically.

__Transpiling source__

If I wanted to write `es6` or `coffeescript` or whatever, I could have `module-harvest` automatically transpile the source contents before it plops in into a `local_module`.

### For Hard Linking

It was a nice thought early on that the files would be automatically connected with hard links, that way if I edit a file in the `superproject` it is updated in the `local_module`. This isn't great because it doesn't paint the full picture. If a `local_module` adds a new dep after it is created it won't magically add that file, `module-harvest` for that `local_module` needs to be built all over again. It's apparent that linking alone isn't the answer. Whenever a `superproject` file is saved the files for all modules that use that file need to be `harvested` a list of `diff` files from the new `local_module` and old `local_module` need to be created. The ability for files to get removed or added will be necessary.

An alternative to the `diff` is to delete the entire module contents (everything except .git) if it exists every time a `module-harvest` is run. This will provide the pruning (?) action without a diff tree.

## harvest.json

Here's what this `superproject`'s `harvest.json` looks like, it's a `1:1` map of arguments that `module-harvest` takes. These variables extend any arguments passed into `module_harvest` directly.

```
{
  "githubAccessToken": <token>,
  "githubRepoPrefix": "node-"
}
```

## Module Bin Examples

```
./bin/module-bin.js ./recursive-deps.js '["./recursive-deps.js", "./bin/module-bin.js"]' --type=promise --method=mapRelativePaths
./bin/module-bin.js ./recursive-deps.js ./recursive-deps.js --type=promise --method=mapRelativePaths
./bin/module-bin.js ./github-create-repo.js <github-access-token> <github-repo> --type=promise
```

## Getting a new module up and running

### Command line only

```bash
# creates github repo `reggi/node-module-bin`
thomas@workstation:node-reggi$ ./bin/module-bin.js ./github-create-repo.js <github-access-token> node-module-bin --type=promise
.. response from github
# harvests `module-bin`
thomas@workstation:node-reggi$ ./bin/module-harvest.js ./module-bin.js
# init's the new repo
thomas@workstation:node-reggi$ git -C ./local_modules/module-bin/ init
Initialized empty Git repository in /Users/thomas/Desktop/labratory/node-reggi/local_modules/module-bin/.git/
# add all files
thomas@workstation:node-reggi$ git -C ./local_modules/module-bin/ add -A
# commit initial
thomas@workstation:node-reggi$ git -C ./local_modules/module-bin/ commit -m 'init'
[master (root-commit) 130b8aa] init
 4 files changed, 174 insertions(+)
 create mode 100755 bin/module-bin.js
 create mode 100644 module-bin.js
 create mode 100644 package.json
 create mode 100644 test/module-bin.js
# add the github origin repo
thomas@workstation:node-reggi$ git -C ./local_modules/module-bin/ remote add origin https://github.com/reggi/node-module-bin.git
# push the module
thomas@workstation:node-reggi$ git -C ./local_modules/module-bin/ push origin master
```

Then it seems the only way to continue is to remove the new module and clone it again with `gits attach`.

```bash
$$
thomas@workstation:node-reggi$ rm -rf ./local_modules/module-bin
thomas@workstation:node-reggi$ gits attach https://github.com/reggi/node-module-bin.git local_modules/module-bin
Cloning into 'local_modules/module-bin'...
```

At the end of all this, you have a `slave` repo to the `superproject` and evey thing is in-sync.

### Gitslave + Module Harvest

I've created this super-project [`reggi/node-reggi`](https://github.com/reggi/node-reggi) which contains javascript files.

Consequently, one of these files is called `./module-harvest.js`, it's executable counterpart `./bin/module-harvest.js` takes a javascript file as an argument and will build that file into a proper npm javascript module by tracking down it's dependencies and building a `package.json` file. When `module-harvest` consumes itself in the case of running the following command.

```
./bin/module-harvest.js ./module-harvest.js --desc=':corn: Harvests package dependencies and builds module from file.'`
```

This command creates the module `./local_modules/module-harvest`.

If you have a `harvest.json` file present in the working directory, as I do, and it contains a github access token / prefix, the command will also create the repo and commit it to github. (these options can also be added to the command)

Here it is:

[https://github.com/reggi/node-module-harvest](https://github.com/reggi/node-module-harvest)

Now if you run the following its up on npm.

```
cd ./local_modules/module
npm publish
```

And it seems that if I want it to be apparent of `gitslave` for the project that I need to do this.

```
rm -rf ./local_modules/module-harvest.js
gits attach https://github.com/reggi/node-module-harvest.js.git local_modules/module-harvest.js
```
