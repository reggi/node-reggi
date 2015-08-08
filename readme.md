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
```
