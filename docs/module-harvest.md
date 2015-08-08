<a name="moduleHarvest"></a>
## moduleHarvest(mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName, packageFile)
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


* [moduleHarvest(mainFile, moduleName, testDir, docsDir, localDir, packagesDir, binDir, readmeName, packageFile)](#moduleHarvest)
  * [.writePackage()](#moduleHarvest.writePackage)
  * [.makeLinks()](#moduleHarvest.makeLinks)
  * [.debugMsg()](#moduleHarvest.debugMsg)
  * [.debugCatch()](#moduleHarvest.debugCatch)

<a name="moduleHarvest.writePackage"></a>
### moduleHarvest.writePackage()
write pacakge from existing, backup, or generate fresh

**Kind**: static method of <code>[moduleHarvest](#moduleHarvest)</code>  
<a name="moduleHarvest.makeLinks"></a>
### moduleHarvest.makeLinks()
make hard links

**Kind**: static method of <code>[moduleHarvest](#moduleHarvest)</code>  
<a name="moduleHarvest.debugMsg"></a>
### moduleHarvest.debugMsg()
debug message from promise then

**Kind**: static method of <code>[moduleHarvest](#moduleHarvest)</code>  
<a name="moduleHarvest.debugCatch"></a>
### moduleHarvest.debugCatch()
catch message for debug from promise catch

**Kind**: static method of <code>[moduleHarvest](#moduleHarvest)</code>  
