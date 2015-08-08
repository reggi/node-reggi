# Node.js: reggi

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

## Todo

* Writing Documentation
  * JSDoc Validation
* Building Documentation, Watch script
* Building Modules, Watch script
* Building Bin Files
* `autoGitInit` feature
* `autoGithubRepo` feature
* `repoBackup` feature
* Cake in es6 support
* add common .gitignore to built modules
  * npm-debug.log
  * node_modules

## Flow

* get deps for main file -> [file, deps]
* get all tests for local deps -> [deps.local, possibleTestFiles]
  * ./test/{filename}.test.{exttname}
  * ./test/{dirname}/{filename}.test.{exttname}
  * ./test/{filename}.{exttname}
  * ./test/{dirname}/{filename}.{exttname}
* check existence of possible test files [possibleTestFiles, testFiles]
  * if any tests exist append tests dir to link list [testfiles.length link.push([paths.test, paths.testDst])]
  * if test existing files append to link list [testFiles.length, link.concat(testFiles)]

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
