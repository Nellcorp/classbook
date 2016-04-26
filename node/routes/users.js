var express = require('express');
var passport = require('passport');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Session = require('../models/Session.js');
var Schedule = require('../models/Schedule.js');
var Subject = require('../models/Subject.js');
var Course = require('../models/Course.js');
var School = require('../models/School.js');
var Absence = require('../models/Absence.js');
var kue = require('kue');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  User.find(req.query,function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});


/* GET /todos/id */
router.get('/:id', function(req, res, next) {

  User.findById(req.params.id, function (err, post) {
    if (err) return res.status(500).json(err);
    if (post == null) return res.status(404).json({ error: "User Not found." });
    res.json(post);
  });
});


/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(500).json(err);
    if (user == null) return res.status(404).json({ error: "Utilizador inválido" });
    
    if(user.type == 'admin'){ //Do not delete last admin
    User.find({type: 'admin'},function (err, admins) {
    if (err) return res.status(500).json(err);
    if(admins.length <= 1){ return res.status(500).json({message: "Não pode eliminar o último administrador"});}
    if (req.user._id == req.params.id){ return res.status(500).json({message: "Não pode eliminar a sua própria conta"}); }
    User.findByIdAndRemove(req.params.id, function (err, success) { if (err) return res.status(500).json({message: "Não foi possível eliminar o utilizador"}); res.json(success); });
  });
  }
  
  if(user.type == 'manager'){
    var school = user.school;
    Absence.remove({ school: school }, function (err, success) {
      if (err) return res.status(500).json(err);
    
      Session.remove({ school: school }, function (err, success) {
        if (err) return res.status(500).json(err);

        Schedule.remove({ school: school }, function (err, success) {
          if (err) return res.status(500).json(err);
        
          Subject.remove({ school: school }, function (err, success)  {
          if (err) return res.status(500).json(err);
        
            Course.remove({ school: school }, function (err, success) {
            if (err) return res.status(500).json(err);
        
              User.remove({ school: school }, function (err, success) {
                if (err) return res.status(500).json(err);
                School.findByIdAndRemove(school, function (err, success) {
                  if (err) return res.status(500).json({message: "Não foi possível eliminar a escola"});
                  res.json(success); });
              });
            });
          });
        });
      });
    });
  }
  
  if(user.type == 'professor'){
    var school = user.school;
    console.log(user.type);
    Absence.remove({ user: user._id }, function (err, success) {
      if (err) return res.status(500).json(err);
    
      Session.remove({ professor: user._id }, function (err, success) {
        if (err) return res.status(500).json(err);

        Schedule.remove({ professor: user._id }, function (err, success) {
          if (err) return res.status(500).json(err);
        
          User.remove({ _id: user._id }, function (err, success) {
            if (err) return res.status(500).json(err);
            res.json(success);
          });
        });
      });
    });
  }

  if(user.type == 'student'){
    var school = user.school;
    Absence.remove({ user: user._id }, function (err, success) {
      if (err) return res.status(500).json(err);
        User.remove({ _id: user._id }, function (err, success) {
          if (err) return res.status(500).json(err);
          res.json(success);
        });
    });
  }

  });


  

  
})

module.exports = router;

