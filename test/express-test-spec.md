All should return json

```


"app":[
  [
    json
  ]
]


app.get/route/array/middleware/json


var path = require("path")
var express = require("express")

function expressAppCreator(str){

  var pieces = str.split(path.sep)

  var appMethod = pieces.split(".")[1]
  var routes = pieces.split(".")[1]

  var app = express()

  app[method]

  return app

}



/app/

/app/route-1/middleware-1/array/json
/app/route-1/middleware-1/function/json
/app/route-1/middleware-1/function-promise-route/json


/app-route-1/array/middleware-1/function-promise-route-1/array/middleware-1/json

/app-route-1/array/middleware-1/array/function-promise-route-1/function
/app-route-1/array/middleware-1/function/function-promise-route-1/


/app/route-1/middleware-1/function-express-route/json
/app/route-1/middleware-1/function/next/route-1/middleware-1/json
/app/route-1/middleware-1/array/next/route-1/middleware-1/json
/app/route-1/middleware-1/function/next/route-1/middleware-1/json
/app/route-1/middleware-1/function-promise-route/next/route-1/middleware-1/json
/app/route-1/middleware-1/function-express-route/next/route-1/middleware-1/json
/app/route-1/middleware-1/function/next/route-2/middleware-1/json
/app/route-1/middleware-1/array/next/route-2/middleware-1/json
/app/route-1/middleware-1/function/next/route-2/middleware-1/json
/app/route-1/middleware-1/function/nextroute-2/middleware-1/json
/app/route-1/middleware-1/function-promise-route/next/route-2/middleware-1/json
/app/route-1/middleware-1/function-express-route/next/route-2/middleware-1/json
/app/route-1/middleware-1/array/next_json
/app/route-1/middleware-1/function/next_json
/app/route-1/middleware-1/function-promise-route/next_json
/app/route-1/middleware-1/function-express-route/next_json
/app/route-1/middleware-1/function/next/route-1/middleware-1/next_json
/app/route-1/middleware-1/array/next/route-1/middleware-1/next_json
/app/route-1/middleware-1/function/next/route-1/middleware-1/next_json
/app/route-1/middleware-1/function-promise-route/next/route-1/middleware-1/next_json
/app/route-1/middleware-1/function-express-route/next/route-1/middleware-1/next_json
/app/route-1/middleware-1/function/next/route-2/middleware-1/next_json
/app/route-1/middleware-1/array/next/route-2/middleware-1/next_json
/app/route-1/middleware-1/function/next/route-2/middleware-1/next_json
/app/route-1/middleware-1/function/nextroute-2/middleware-1/next_json
/app/route-1/middleware-1/function-promise-route/next/route-2/middleware-1/next_json
/app/route-1/middleware-1/function-express-route/next/route-2/middleware-1/next_json

/app/promise-route/route-1/middleware-1/array/json
/app/promise-route/route-1/middleware-1/function/json
/app/promise-route/route-1/middleware-1/function-promise-route/json
/app/promise-route/route-1/middleware-1/function-express-route/json
/app/promise-route/route-1/middleware-1/function/next/route-1/middleware-1/json
/app/promise-route/route-1/middleware-1/array/next/route-1/middleware-1/json
/app/promise-route/route-1/middleware-1/function/next/route-1/middleware-1/json
/app/promise-route/route-1/middleware-1/function-promise-route/next/route-1/middleware-1/json
/app/promise-route/route-1/middleware-1/function-express-route/next/route-1/middleware-1/json
/app/promise-route/route-1/middleware-1/function/next/route-2/middleware-1/json
/app/promise-route/route-1/middleware-1/array/next/route-2/middleware-1/json
/app/promise-route/route-1/middleware-1/function/next/route-2/middleware-1/json
/app/promise-route/route-1/middleware-1/function/nextroute-2/middleware-1/json
/app/promise-route/route-1/middleware-1/function-promise-route/next/route-2/middleware-1/json
/app/promise-route/route-1/middleware-1/function-express-route/next/route-2/middleware-1/json
/app/promise-route/route-1/middleware-1/array/next_json
/app/promise-route/route-1/middleware-1/function/next_json
/app/promise-route/route-1/middleware-1/function-promise-route/next_json
/app/promise-route/route-1/middleware-1/function-express-route/next_json
/app/promise-route/route-1/middleware-1/function/next/route-1/middleware-1/next_json
/app/promise-route/route-1/middleware-1/array/next/route-1/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function/next/route-1/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function-promise-route/next/route-1/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function-express-route/next/route-1/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function/next/route-2/middleware-1/next_json
/app/promise-route/route-1/middleware-1/array/next/route-2/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function/next/route-2/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function/nextroute-2/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function-promise-route/next/route-2/middleware-1/next_json
/app/promise-route/route-1/middleware-1/function-express-route/next/route-2/middleware-1/next_json

/app/express-route/route-1/middleware-1/array/json
/app/express-route/route-1/middleware-1/function/json
/app/express-route/route-1/middleware-1/function-promise-route/json
/app/express-route/route-1/middleware-1/function-express-route/json
/app/express-route/route-1/middleware-1/function/next/route-1/middleware-1/json
/app/express-route/route-1/middleware-1/array/next/route-1/middleware-1/json
/app/express-route/route-1/middleware-1/function/next/route-1/middleware-1/json
/app/express-route/route-1/middleware-1/function-promise-route/next/route-1/middleware-1/json
/app/express-route/route-1/middleware-1/function-express-route/next/route-1/middleware-1/json
/app/express-route/route-1/middleware-1/function/next/route-2/middleware-1/json
/app/express-route/route-1/middleware-1/array/next/route-2/middleware-1/json
/app/express-route/route-1/middleware-1/function/next/route-2/middleware-1/json
/app/express-route/route-1/middleware-1/function/nextroute-2/middleware-1/json
/app/express-route/route-1/middleware-1/function-promise-route/next/route-2/middleware-1/json
/app/express-route/route-1/middleware-1/function-express-route/next/route-2/middleware-1/json
/app/express-route/route-1/middleware-1/array/next_json
/app/express-route/route-1/middleware-1/function/next_json
/app/express-route/route-1/middleware-1/function-promise-route/next_json
/app/express-route/route-1/middleware-1/function-express-route/next_json
/app/express-route/route-1/middleware-1/function/next/route-1/middleware-1/next_json
/app/express-route/route-1/middleware-1/array/next/route-1/middleware-1/next_json
/app/express-route/route-1/middleware-1/function/next/route-1/middleware-1/next_json
/app/express-route/route-1/middleware-1/function-promise-route/next/route-1/middleware-1/next_json
/app/express-route/route-1/middleware-1/function-express-route/next/route-1/middleware-1/next_json
/app/express-route/route-1/middleware-1/function/next/route-2/middleware-1/next_json
/app/express-route/route-1/middleware-1/array/next/route-2/middleware-1/next_json
/app/express-route/route-1/middleware-1/function/next/route-2/middleware-1/next_json
/app/express-route/route-1/middleware-1/function/nextroute-2/middleware-1/next_json
/app/express-route/route-1/middleware-1/function-promise-route/next/route-2/middleware-1/next_json
/app/express-route/route-1/middleware-1/function-express-route/next/route-2/middleware-1/next_json
```

All should return error
