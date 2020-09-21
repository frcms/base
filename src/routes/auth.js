var express = require('express');
const db = require('../db');
var router = express.Router();

var passlib = require("../password")

var settings = require("../../settings.json")

var crypto = require('crypto');
const e = require('express');

router.get('/login', async function(req, res) {
    res.render('admin/login', {
        "settings": settings
    })
})
  
router.post('/login', function(req, res) {
    db.Users.findOne({ email: req.body.email }, function (err, doc) {
        if (err) return console.error(err)
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
            db.Users.findOneAndUpdate({ email: req.body.email }, doc, function(err, doc){
                if (err) return console.error(err)
                res.redirect('/dashboard')
            })
        } else {
            res.render("admin/login", { message: "Incorrect Password" })
        }
    })

})

module.exports = router