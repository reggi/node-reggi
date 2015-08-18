var express = require("express")
var app = express()

app.get("/", function(req, res, next){
  var router = express.Router()
  router.use(function(req, res, next){
    return res.json({"name":"tobi"})
  })
  return router(req, res, next)
})

module.exports = app
