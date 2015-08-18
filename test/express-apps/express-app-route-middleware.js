var express = require("express")
var app = express()

// var router = express.Router
var router = require("express-promise-router")

app.get("/", function(req, res, next){

  console.log(typeof req)
  console.log(typeof res)
  console.log(typeof next)
  console.log(typeof router)

  return res.json({"name":"tobi"})
})

// module.exports = app

app.listen(3000)
