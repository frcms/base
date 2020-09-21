var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashRouter = require('./routes/dashboard');
var authRouter = require('./routes/auth');

var useragent = require('express-useragent');

var geoip = require('geoip-lite');

var app = express();
var nunjucks = require('nunjucks');
const { compile } = require('morgan');
// view engine setup
app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
  express: app,
  autoescape: true,
  watch: true,
  noCache: true,
  throwOnUndefined: true
});

app.set('view engine', 'html');
app.set('trust proxy', true)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/dist", express.static(path.join(__dirname, 'dist'), { maxAge: 0 }));
app.use("/plugins", express.static(path.join(__dirname, 'plugins'), { maxAge: 0 }));

app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')))

app.use(useragent.express())

app.use(function(req, res, next){
  if (req.url === "/setup" || req.url === "/setup/mail") return next()
  var count
  db.Users.countDocuments({}, function(err, c) {
    if (err) return console.error(err)
    console.log(c)
    if (c === 0) {
      res.redirect('/setup')
    } else {
      next()
    }
    
  })

})



app.use(async function(req, res, next) {
  if (req.url.startsWith('/dashboard') || req.url.startsWith('/auth') || req.url.startsWith('/socket.io') || req.url.startsWith('/dist') || req.url.startsWith('/plugins') || req.url.startsWith("/favicon.ico")) return next()
  db.Analytics.exists({ "data.sessionid": req.cookies.SID }, async function(err, result) {
    if (err) return console.error(err)
    console.log(result)
    if (!result) {
      sid = crypto.randomBytes(16).toString('base64')
      await db.Analytics.create({
        dataType: "client",
        data: {
          sessionid: sid,
          ip: req.ip,
          geoip: (geoip.lookup(req.ip) === null ? "localhost" : geoip.lookup(req.ip)),
          browser: req.useragent,
          pages: [{ 
            url: req.url,
            timestamp: Date.now()
          }]
        }
      })
      res.cookie('SID', sid, { expires: new Date(Date.now() + 604800000) })
      next()    
    } else {
      db.Analytics.findOne({ "data.sessionid": req.cookies.SID }, async function(err, doc) {
        if (doc.data.pages.some(page => page.url === req.url) && doc.data.pages.some(page => page.timestamp <= new Date(Date.now() - 5000).getTime())) {
          console.log("within 5s, skipping")
          console.log(doc.data.pages.some(page => page.url === req.url), doc.data.pages.some(page => page.timestamp <= new Date(Date.now() - 5000).getTime()))
          return next()
        }
        doc.data.pages.push({ url: req.url, timestamp: Date.now() })
        doc.data.ip = req.ipm
        doc.data.geoip = (geoip.lookup(req.ip) === null ? "localhost" : geoip.lookup(req.ip))
        doc.data.browser = req.useragent
        doc.markModified('data.pages')
        doc.save({ validateBeforeSave: true }, function(err, d) {
          console.log(d)
          next()
        })
      })
    }
  })
})

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var db = require('./db')
var crypto = require('crypto')
app.use(session({
  secret: crypto.randomBytes(16).toString("hex"),
  store: new MongoStore({ mongooseConnection: db.mongoose.connection }),
  cookie: {
    expires: new Date(Date.now() + 604800000),
  },
  saveUninitialized: false,
  resave: false
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/dashboard', function(req, res, next) {
  if (!req.session.token) {
    return res.redirect("/auth/login")
  }
  db.Users.findOne({ "userData.token": req.session.token }, function(err, doc) {
    if (req.session.token !== doc.userData.token){
      return res.redirect("/auth/login")
    } else {
      next()
    }
  })
})

app.use('/dashboard', dashRouter);
app.use('/auth', authRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if (req.url.startsWith("/dashboard")){
    res.render('admin/404')
  }
  app.render('404')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req.url.startsWith("/dashboard")){
    res.render('admin/500')
  }
  res.render('500');
});

module.exports = app;
