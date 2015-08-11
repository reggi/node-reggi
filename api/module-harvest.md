<a name="module_module-harvest"></a>
## module-harvest
:corn: Build a module from a single javascript file.

**Package.keywords**: dependency, dependencies, build, package.json, harvest, module  
**Package.preferglobal**:   
**Package.repository.type**: git  
**Package.repository.url**: https://github.com/reggi/node-module-harvest  

* [module-harvest](#module_module-harvest)
  * [~moduleHarvest()](#module_module-harvest..moduleHarvest)
    * [.defaultArgs](#module_module-harvest..moduleHarvest.defaultArgs)
    * [.configFiles](#module_module-harvest..moduleHarvest.configFiles)
    * [.defaultArgData()](#module_module-harvest..moduleHarvest.defaultArgData)
    * [.argMerge()](#module_module-harvest..moduleHarvest.argMerge)
    * [.prefaceLinkArgs()](#module_module-harvest..moduleHarvest.prefaceLinkArgs)
    * [.objLinkArgs()](#module_module-harvest..moduleHarvest.objLinkArgs)
    * [.existingFiles()](#module_module-harvest..moduleHarvest.existingFiles)
    * [.runTrackDevDeps()](#module_module-harvest..moduleHarvest.runTrackDevDeps)
    * [.deps()](#module_module-harvest..moduleHarvest.deps)
    * [.removeEmoji()](#module_module-harvest..moduleHarvest.removeEmoji)
    * [.designateDeps()](#module_module-harvest..moduleHarvest.designateDeps)
    * [.debugMsg()](#module_module-harvest..moduleHarvest.debugMsg)
    * [.debugCatch()](#module_module-harvest..moduleHarvest.debugCatch)
    * [.writePackage()](#module_module-harvest..moduleHarvest.writePackage)
    * [.buildLinks()](#module_module-harvest..moduleHarvest.buildLinks)
    * [.detectBin()](#module_module-harvest..moduleHarvest.detectBin)
    * [.packageBin()](#module_module-harvest..moduleHarvest.packageBin)

<a name="module_module-harvest..moduleHarvest"></a>
### module-harvest~moduleHarvest()
Tracks down package dependencies, and local, main, and bin files.

**Kind**: inner method of <code>[module-harvest](#module_module-harvest)</code>  

* [~moduleHarvest()](#module_module-harvest..moduleHarvest)
  * [.defaultArgs](#module_module-harvest..moduleHarvest.defaultArgs)
  * [.configFiles](#module_module-harvest..moduleHarvest.configFiles)
  * [.defaultArgData()](#module_module-harvest..moduleHarvest.defaultArgData)
  * [.argMerge()](#module_module-harvest..moduleHarvest.argMerge)
  * [.prefaceLinkArgs()](#module_module-harvest..moduleHarvest.prefaceLinkArgs)
  * [.objLinkArgs()](#module_module-harvest..moduleHarvest.objLinkArgs)
  * [.existingFiles()](#module_module-harvest..moduleHarvest.existingFiles)
  * [.runTrackDevDeps()](#module_module-harvest..moduleHarvest.runTrackDevDeps)
  * [.deps()](#module_module-harvest..moduleHarvest.deps)
  * [.removeEmoji()](#module_module-harvest..moduleHarvest.removeEmoji)
  * [.designateDeps()](#module_module-harvest..moduleHarvest.designateDeps)
  * [.debugMsg()](#module_module-harvest..moduleHarvest.debugMsg)
  * [.debugCatch()](#module_module-harvest..moduleHarvest.debugCatch)
  * [.writePackage()](#module_module-harvest..moduleHarvest.writePackage)
  * [.buildLinks()](#module_module-harvest..moduleHarvest.buildLinks)
  * [.detectBin()](#module_module-harvest..moduleHarvest.detectBin)
  * [.packageBin()](#module_module-harvest..moduleHarvest.packageBin)

<a name="module_module-harvest..moduleHarvest.defaultArgs"></a>
#### moduleHarvest.defaultArgs
object of arguments and default values

**Kind**: static property of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.configFiles"></a>
#### moduleHarvest.configFiles
acceptable config files

**Kind**: static property of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.defaultArgData"></a>
#### moduleHarvest.defaultArgData()
default set of arguments totally overwritable or appendable

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.argMerge"></a>
#### moduleHarvest.argMerge()
merge two object's arrays

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
**See**: [https://lodash.com/docs#merge](https://lodash.com/docs#merge)  
<a name="module_module-harvest..moduleHarvest.prefaceLinkArgs"></a>
#### moduleHarvest.prefaceLinkArgs()
prefaces hard links path arguments from array of args [src, dst]

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.objLinkArgs"></a>
#### moduleHarvest.objLinkArgs()
convert array of [src, dst] links to object

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.existingFiles"></a>
#### moduleHarvest.existingFiles()
returns existing files from array of files

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.runTrackDevDeps"></a>
#### moduleHarvest.runTrackDevDeps()
get all the possible test files

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.deps"></a>
#### moduleHarvest.deps()
get the deps for all files and test files

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.removeEmoji"></a>
#### moduleHarvest.removeEmoji()
removes github style emoji froms sring

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.designateDeps"></a>
#### moduleHarvest.designateDeps()
assign versions to dependencies via given pacakge

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.debugMsg"></a>
#### moduleHarvest.debugMsg()
debug message from promise then

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.debugCatch"></a>
#### moduleHarvest.debugCatch()
catch message for debug from promise catch

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.writePackage"></a>
#### moduleHarvest.writePackage()
write pacakge from existing, backup, or generate fresh

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.buildLinks"></a>
#### moduleHarvest.buildLinks()
make hard links

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.detectBin"></a>
#### moduleHarvest.detectBin()
detects if files have shebang declaration

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
<a name="module_module-harvest..moduleHarvest.packageBin"></a>
#### moduleHarvest.packageBin()
readys array of bin files for package.bin

**Kind**: static method of <code>[moduleHarvest](#module_module-harvest..moduleHarvest)</code>  
