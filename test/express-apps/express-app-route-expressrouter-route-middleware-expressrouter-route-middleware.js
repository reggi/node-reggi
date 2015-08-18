var express = require("express")
var app = express()
var promiseRouter = require("express-promise-router")

var router = express.Router()

router.get("/", function(req, res, next){
  var router = express.Router()
  router.use(function(req, res, next){
    return res.json({"name":"tobi"})
  })
  return router(req, res, next)
})

app.use(router)

module.exports = app
