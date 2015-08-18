var express = require("express")
var app = express()
var promiseRouter = require("express-promise-router")

app.get("/", function(req, res, next){
  var router = promiseRouter()
  router.use(function(req, res, next){
    return res.json({"name":"tobi"})
  })
  return router(req, res, next)
})

module.exports = app
