var express = require('express');
var router = express.Router();

var db = require("../db")

var bcrypt = require('bcrypt')

var passlib = require("../password")

const editJsonFile = require("edit-json-file");

let settings = editJsonFile("../settings.json")

router.get('/setup', async function(req, res){
  res.render('firsttime')
})

router.post('/setup', async function(req, res){
  var fullName = req.body.fullname.split(" ")
  console.log(fullName, fullName.length)
  db.Users.create({
    username: req.body.username,
    email: req.body.email,
    password: await passlib.cryptPassword(req.body.password),
    name: {
      first: fullName[0],
      middle: (fullName.length >= 3 ? fullName[1] : ""),
      last: (fullName.length >= 3 ? fullName[2] : fullName[1])
    },
  })
  res.redirect('/setup/mail')
})

router.get('/setup/mail', async function(req, res){
  res.render('mailsetup')
})

router.post('/setup/mail', async function(req, res) {
  console.log(req.body)
  settings.set("mail.service", req.body.service)
  settings.set("mail.username", req.body.username)
  settings.set("mail.password", req.body.password)
  settings.set("mail.host", req.body.host)
  settings.set("mail.port", req.body.port)
  settings.set("mail.secure", (req.body.port === '587' ? true : false))
  await settings.save()
  console.log(settings)
  res.redirect("/auth/login")
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
