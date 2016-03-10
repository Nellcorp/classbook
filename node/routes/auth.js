var express = require('express');
var passport = require('passport');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

router.post('/register', function(req, res, next) {
  var password = req.body.password;
  delete req.body.password;
  User.register(req.body, password, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.status(200).send(req.user);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send("success");
});

router.get('/valid', function(req, res) {
    if (req.isAuthenticated()){
      res.status(200).send(req.user);
    }else{
      res.status(401).send();
    }
    
});


module.exports = router;