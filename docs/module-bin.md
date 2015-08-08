<a name="moduleBin"></a>
## moduleBin(filePath, args, [functionMethod], [type], [toLog], [toThrow], [toStringify])
Proxy the execution of an entire node module.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | Path to main javascript file. |
| args | <code>Array</code> | Array of arguments to apply to the function. |
| [functionMethod] | <code>String</code> | String of specific function method to execute |
| [type] | <code>String</code> | Type of function to run (promise||callback) |
| [toLog] | <code>Boolean</code> | Option to log the output (defaults true). |
| [toThrow] | <code>Boolean</code> | Option to throw error (defaults true). |
| [toStringify] | <code>Boolean</code> | Option to JSON.stringify output (defaults true). |

