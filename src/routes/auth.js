var express = require('express');
const db = require('../db');
var router = express.Router();

var passlib = require("../password")

var crypto = require('crypto');
const e = require('express');

router.get('/login', async function(req, res) {
    res.render('admin/login')
})
  
router.post('/login', function(req, res) {
    console.log("DO THE THING")
    db.Users.findOne({ email: req.body.email }, function (err, doc) {
        if (err) return console.error(err)
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        if (!doc) {
            return res.render('admin/login', { message: "User doesn't exist!" })
        }
        if (passlib.comparePassword(req.body.password, doc.password)) {
            var token = crypto.randomBytes(16).toString("hex");
            if (!req.session.token) {
                req.session.token = token
            } else {
                req.session.token = token
            }
            doc.userData.token = token
            console.log('ssss')
            db.Users.findOneAndUpdate({ email: req.body.email }, doc, function(err, doc){
                console.log("bruh moment")
                if (err) return console.error(err)
                console.log(doc)
                res.redirect('/dashboard')
            })
        } else {
            res.render("admin/login", { message: "Incorrect Password" })
        }
    })

})

module.exports = router