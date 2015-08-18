var express = require("express")
var app = express()

var router = express.Router()

router.get("/", function(req, res, next){
  return res.json({"name":"tobi"})
})

app.use(router)

module.exports = app
