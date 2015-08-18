var express = require("express")
var app = express()
var promiseRouter = require("express-promise-router")

var router = promiseRouter()

router.get("/", function(req, res, next){
  return res.json({"name":"tobi"})
})

app.use(router)

module.exports = app
