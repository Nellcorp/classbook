var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var School = require('../models/School.js');
var User = require('../models/User.js');
var Signup = require('../models/Signup.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Signup.find(req.query,function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {

  console.log('Before: ', req.body);

  School.find({$or : [{name: req.body.school.name}, {phone: req.body.school.school_phone}]},function (err, school) {
    if (err) return res.status(500).json(err);
    if (school.length !== 0) return res.status(500).json("Esta escola já está registada.");
    
    User.find({$or : [{phone: req.body.phone}, {email: req.body.email}]},function (err, user) {
      if (err) return res.status(500).json(err);
      if (user.length !== 0) return res.status(500).json("Esta escola já está registada.");
    
      Signup.find({$or : [{phone: req.body.phone}, {school_phone: req.body.school_phone}, {school: req.body.school}, {email: req.body.email}]},function (err, signup) {
      if (err) return res.status(500).json(err);
      if (signup.length !== 0) return res.status(500).json("Já existe uma inscrição pendente para esta escola. Se inscreveu a escola há mais de 15 dias, contacte-nos via info@classbook.com.");
    
      Signup.create(req.body, function (err, post) {
        if (err) return res.status(500).json(err);
        res.json(post);
      });
    });    
    });    
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Signup.findById(req.params.id, function (err, post) {
    if (err) return res.status(500).json(err);
    if (post === null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Signup.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
    
    Signup.remove({ _id: req.params.id }, function (err, removed) {
      if (err) return res.status(500).json(err);
      if (removed.hasOwnProperty('n') && removed.n === 0) return res.status(500).json('Registo não encontrado.');

      Signup.find(req.query,function (err, signups) {
        if (err) return res.status(500).json(err);
        res.json({signups: signups});
      });
      //res.json(removed);
    });
});

module.exports = router;

