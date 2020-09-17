var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashRouter = require('./routes/dashboard');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/plugins", express.static(path.join(__dirname, 'plugins')));

app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashRouter);

var db = require('./db')

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if (req.path.startsWith("/dashboard")){
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
  if (req.path.startsWith("/dashboard")){
    res.render('admin/500')
  }
  res.render('500');
});

module.exports = app;
