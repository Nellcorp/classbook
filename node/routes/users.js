var express = require('express');
var passport = require('passport');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  User.find(req.query,function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/register', function(req, res, next) {
  var password = req.body.password;
  delete req.body.password;
  User.register(req.body, password, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.status(200).send("success");
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send("success");
});


/* GET /todos/id */
router.get('/:id', function(req, res, next) {

  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
})

module.exports = router;

