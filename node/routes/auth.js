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
  var sanitized = {
    _id: req.user._id,
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    school: req.user.school,
    phone: req.user.phone,
    type: req.user.type
  };
  
  //res.status(200).send(sanitized);
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