var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Session = require('../models/Session.js');
var Schedule = require('../models/Schedule.js');
var Subject = require('../models/Subject.js');
var Course = require('../models/Course.js');
var Absence = require('../models/Absence.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Course.find(req.query,function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Course.create(req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Course.findById(req.params.id, function (err, post) {
    if (err) return res.status(500).json(err);
    if (post == null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Course.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
//delete absences, sessions, schedules, subjects, students, courses
router.delete('/:id', function(req, res, next) {
  Course.findByIdAndRemove(req.params.id, function (err, success) {
    if (err) return res.status(500).json({message: "Não foi possível eliminar o curso"});
    Absence.remove({course: req.params.id}, function (err, success) {
      if (err) return res.status(500).json({message: "Não foi possível eliminar as faltas do curso"});
      Session.remove({course: req.params.id}, function (err, success) {
        if (err) return res.status(500).json({message: "Não foi possível eliminar as aulas do curso"});
        Schedule.remove({course: req.params.id}, function (err, success) {
          if (err) return res.status(500).json({message: "Não foi possível eliminar os horários do curso"});
          Subject.remove({course: req.params.id}, function (err, success) {
            if (err) return res.status(500).json({message: "Não foi possível eliminar as disciplinas do curso"});
            User.remove({type: 'student', course: req.params.id}, function (err, success) {
              if (err) return res.status(500).json({message: "Não foi possível eliminar os alunos do curso"});
              res.json(success);
            });
          });
        });
      });
    });
  });
})

module.exports = router;

