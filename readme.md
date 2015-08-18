# Risk

## createExpressApp

Returns an express `app` with one `method` / `route`.

```javascript
createExpressApp(Router, method, url, middleware)
createExpressApp.withAppRouter(method, url, middleware)
createExpressApp.withRouter(method, url, middleware)
createExpressApp.withPromiseRouter(method, url, middleware)
createExpressApp.array(method, url, middleware)
```

## middlewareRun

Executes express `middleware`.

```javascript
middlewareRun(Router, req, res, middleware)
middlewareRun.withAppRouter(req, res, middleware)
middlewareRun.withRouter(req, res, middleware)
middlewareRun.withPromiseRouter(req, res, middleware)
```

## Logging function

```javascript
function log(string, val){
  console.log("/////"+string+"/////")
  console.log(val)
}
```

Log functions of objects

function functionName(fn){
  return /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1]
}

```
function logFnObj(obj){
  return _.each(_.keys(obj), function(prop){
    console.log("middlewareRun."+prop)
  })  
}

# Options for express middleware

* `app` (create an app using `express()`)
  1. Directly call HTTP methods on `app` and pass in `urlRoute` and `middleware`
  2. Call an instance of `express.Router()` called `router` and use that to call HTTP methods on `app` and pass in `urlRoute` and `middleware`
