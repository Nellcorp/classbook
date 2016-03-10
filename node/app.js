var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
//var bcrypt = require('bcrypt-nodejs');
//var async = require('async');
//var crypto = require('crypto');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ConnectRoles = require('./roles');


mongoose.connect('mongodb://localhost/node', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});


//Remember to configure cors for all routes
var cors = require('cors');
var whitelist = ['http://classbook.nellcorp.com:3000', 'http://classbook.nellcorp.com'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};


var routes = require('./routes/index');
var User = require('./models/User');
var users = require('./routes/users');
var auth = require('./routes/auth');
var schools = require('./routes/schools');
var courses = require('./routes/courses');
var subjects = require('./routes/subjects');
var coursenames = require('./routes/coursenames');
var subjectnames = require('./routes/subjectnames');
var schedules = require('./routes/schedules');
var sessions = require('./routes/sessions');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://classbook.nellcorp.com:3000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  //res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {res.sendStatus(200);}

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var session = require('express-session');

app.use(session({secret: 'mycroft acia',resave: false,saveUninitialized: false}));


app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var restrict = function (req, res, next) {
  
  if (req.user || req.url === '/auth/login' || req.url === '/auth/valid' || req.url === '/auth/register') {
    next();
  } else {res.sendStatus(401);}
};

app.use(restrict);

app.use(ConnectRoles);

app.use('/', routes);
app.use('/auth', auth);
app.use('/users', users);
app.use('/schools', schools);
app.use('/courses', courses);
app.use('/subjects', subjects);
app.use('/coursenames', coursenames);
app.use('/subjectnames', subjectnames);
app.use('/schedules', schedules);
app.use('/sessions', sessions);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
