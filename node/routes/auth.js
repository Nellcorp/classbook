var express = require('express');
var passport = require('passport');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Token = require('../models/Token.js');

router.post('/register', function(req, res, next) {
  var password = req.body.password;
  console.log(req.body);
  delete req.body.password;
  User.register(req.body, password, function (err, post) {
    console.log(err);
    if (err) return next(err);
    console.log(post);
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
  
  res.status(200).send(sanitized);
  //res.status(200).send(req.user);
});


router.post('/password', function(req, res, next) {

  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    
    if (user == null) return res.status(404).json({ error: "Resource Not found." });

    user.setPassword(req.body.password, function(){
            user.save();
            return res.status(200).json(user);
        });
  });
});

/* GET /todos listing. */
router.get('/tokens/:id', function(req, res, next) {
  Token.findById(req.params.id, function (err, token) {
    if (err) return next(err);
    
    if (token == null) return res.status(404).json(token);
    
    res.json(token);
  });
});

router.post('/reset', function(req, res, next) {

  User.find({phone: req.body.phone},function (err, users) {
    var user = users[0];
    if (err) return next(err);
    
    Token.create({ user: user._id }, function (err, token) {
      if (err) return next(err);
      res.json(token);
  });

  });
});

router.post('/restore', function(req, res, next) {

  Token.findById(req.body.token,function (err, token) {
    if (err) return next(err);
    if (token == null) return res.status(404).json({ error: "Resource Not found." });
    
    User.findById(token.user, function (err, user) {
    if (err) return next(err);
    if (user == null) return res.status(404).json({ error: "Resource Not found." });

      user.setPassword(req.body.password, function(){
            user.save();

            Token.findByIdAndRemove(req.body.token, function (err, post) {
              if (err) return next(err);
                return res.status(200).json(user);
              });
            
        });
  });

  });
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