var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Session = require('../models/Session.js');
var Schedule = require('../models/Schedule.js');
var Subject = require('../models/Subject.js');
var Course = require('../models/Course.js');
var School = require('../models/School.js');
var Group = require('../models/Group.js');
var Absence = require('../models/Absence.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  School.find(req.query,function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {

  
  School.create(req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  School.findById(req.params.id, function (err, post) {
    if (err) return res.status(500).json(err);
    if (post == null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  School.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
    var school = req.params.id;
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
})

module.exports = router;

