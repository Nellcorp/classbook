var express = require('express');
var app = module.exports = express();

var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

user.use(function (req, action) { if (!req.isAuthenticated()) return action === 'access public page';});


user.use('logout', function (req) { return req.isAuthenticated();});
user.use('access public page', function (req) { return req.isAuthenticated();});


//Auth
user.use('check login', function (req) {return true;});
user.use('list token', function (req) {if (req.user.type === 'manager' || req.user.type === 'professor') {return true;}});

//Users
user.use('list users', function (req) {if (req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create users', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});
user.use('change password', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('list user', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete user', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});

//Schools
user.use('list schools', function (req) {if (req.user.type === 'admin') {return true;}});
user.use('create schools', function (req) {if (req.user.type === 'admin') {return true;}});
user.use('list school', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete school', function (req) {if (req.user.type === 'admin') {return true;}});

//Courses
user.use('list courses', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create courses', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});
user.use('list course', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete course', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});

//Subjects
user.use('list subjects', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create subjects', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});
user.use('list subject', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete subject', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});

//Sessions
user.use('list sessions', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create sessions', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('list session', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete session', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});

//Schedules
user.use('list schedules', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create schedules', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});
user.use('list schedule', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete schedule', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});

//Coursenames
user.use('list coursenames', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create coursenames', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});
user.use('list coursename', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete coursename', function (req) {if (req.user.type === 'admin') {return true;}});

//Subjectnames
user.use('list subjectnames', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('create subjectnames', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager') {return true;}});
user.use('list subjectname', function (req) {if (req.user.type === 'admin' || req.user.type === 'manager' || req.user.type === 'professor') {return true;}});
user.use('delete subjectname', function (req) {if (req.user.type === 'admin') {return true;}});


user.use(function (req) {if (req.user.type === 'admin') {return true;}});

//Root path authorization
app.get('/', user.can('access public page'), function (req, res) {});

//Authorization Control
app.get('/auth/register', user.can('access public page'), function (req, res, next) {next();});
app.post('/auth/login', user.can('access public page'), function (req, res, next) {next();});
app.get('/auth/logout', user.can('logout'), function (req, res, next) {next();});
app.get('/auth/valid', user.can('check login'), function (req, res, next) {next();});
app.post('/auth/password', user.can('change password'), function (req, res, next) {next();});
app.post('/auth/reset', user.can('access public page'), function (req, res, next) {next();});
app.post('/auth/restore', user.can('access public page'), function (req, res, next) {next();});
app.get('/auth/tokens/:id', user.can('list token'), function (req, res, next) {next();});

app.get('/users', user.can('list users'), function (req, res, next) {next();});
app.post('/users', user.can('create users'), function (req, res, next) {next();});
app.get('/users/:id', user.can('list user'), function (req, res, next) {next();});
app.put('/users/:id', user.can('update user'), function (req, res, next) {next();});
app.delete('/users/:id', user.can('delete user'), function (req, res, next) {next();});

//School Authorization Control
app.get('/schools', user.can('list schools'), function (req, res, next) {next();});
app.post('/schools', user.can('create school'), function (req, res, next) {next();});
app.get('/schools/:id', user.can('list school'), function (req, res, next) {next();});
app.put('/schools/:id', user.can('update school'), function (req, res, next) {next();});
app.delete('/schools/:id', user.can('delete school'), function (req, res, next) {next();});

//Course Authorization Control
app.get('/courses', user.can('list courses'), function (req, res, next) {next();});
app.post('/courses', user.can('create courses'), function (req, res, next) {next();});
app.get('/courses/:id', user.can('list course'), function (req, res, next) {next();});
app.put('/courses/:id', user.can('update course'), function (req, res, next) {next();});
app.delete('/courses/:id', user.can('delete course'), function (req, res, next) {next();});

//Session Authorization Control
app.get('/sessions', user.can('list sessions'), function (req, res, next) {next();});
app.post('/sessions', user.can('create sessions'), function (req, res, next) {next();});
app.get('/sessions/:id', user.can('list session'), function (req, res, next) {next();});
app.put('/sessions/:id', user.can('update session'), function (req, res, next) {next();});
app.delete('/sessions/:id', user.can('delete session'), function (req, res, next) {next();});

//Subject Authorization Control
app.get('/subjects', user.can('list subjects'), function (req, res, next) {next();});
app.post('/subjects', user.can('create subjects'), function (req, res, next) {next();});
app.get('/subjects/:id', user.can('list subject'), function (req, res, next) {next();});
app.put('/subjects/:id', user.can('update subject'), function (req, res, next) {next();});
app.delete('/subjects/:id', user.can('delete subject'), function (req, res, next) {next();});

//Schedule Authorization Control
app.get('/schedules', user.can('list schedules'), function (req, res, next) {next();});
app.post('/schedules', user.can('create schedules'), function (req, res, next) {next();});
app.get('/schedules/:id', user.can('list schedule'), function (req, res, next) {next();});
app.put('/schedules/:id', user.can('update schedule'), function (req, res, next) {next();});
app.delete('/schedules/:id', user.can('delete schedule'), function (req, res, next) {next();});


//Coursename Authorization Control
app.get('/coursenames', user.can('list coursenames'), function (req, res, next) {next();});
app.post('/coursenames', user.can('create coursenames'), function (req, res, next) {next();});
app.get('/coursenames/:id', user.can('list coursename'), function (req, res, next) {next();});
app.put('/coursenames/:id', user.can('update coursename'), function (req, res, next) {next();});
app.delete('/coursenames/:id', user.can('delete coursename'), function (req, res, next) {next();});

//Subjectname Authorization Control
app.get('/subjectnames', user.can('list subjectnames'), function (req, res, next) {next();});
app.post('/subjectnames', user.can('create subjectnames'), function (req, res, next) {next();});
app.get('/subjectnames/:id', user.can('list subjectname'), function (req, res, next) {next();});
app.put('/subjectnames/:id', user.can('update subjectname'), function (req, res, next) {next();});
app.delete('/subjectnames/:id', user.can('delete subjectname'), function (req, res, next) {next();});