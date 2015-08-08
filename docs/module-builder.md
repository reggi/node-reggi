<a name="moduleBuilder"></a>
## moduleBuilder(mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName, packageFile)
Build a module from file.
Tracks down package dependencies, and local, main, and bin files.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mainFile | <code>string</code> | Path to the main javascript file. |
| moduleName | <code>string</code> | Name of the module. |
| testDir | <code>string</code> | Directory where all the tests are stored. |
| docsDir | <code>string</code> | Directory where all the docs are stored. |
| localDir | <code>string</code> | Directory where built modules are stored. |
| packagesDir | <code>string</code> | Directory where backup package.json files go. |
| binDir | <code>string</code> | Directory where the bin files are stored. |
| readmeName | <code>string</code> | Name of readme files generated in built module (readme.md). |
| packageFile | <code>string</code> | Path of parent pacakge.json file. |


* [moduleBuilder(mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName, packageFile)](#moduleBuilder)
  * [.writePackage()](#moduleBuilder.writePackage)
  * [.makeLinks()](#moduleBuilder.makeLinks)
  * [.debugMsg()](#moduleBuilder.debugMsg)
  * [.debugCatch()](#moduleBuilder.debugCatch)

<a name="moduleBuilder.writePackage"></a>
### moduleBuilder.writePackage()
write pacakge from existing, backup, or generate fresh

**Kind**: static method of <code>[moduleBuilder](#moduleBuilder)</code>  
<a name="moduleBuilder.makeLinks"></a>
### moduleBuilder.makeLinks()
make hard links

**Kind**: static method of <code>[moduleBuilder](#moduleBuilder)</code>  
<a name="moduleBuilder.debugMsg"></a>
### moduleBuilder.debugMsg()
debug message from promise then

**Kind**: static method of <code>[moduleBuilder](#moduleBuilder)</code>  
<a name="moduleBuilder.debugCatch"></a>
### moduleBuilder.debugCatch()
catch message for debug from promise catch

**Kind**: static method of <code>[moduleBuilder](#moduleBuilder)</code>  
