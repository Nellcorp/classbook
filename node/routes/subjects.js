var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Subject = require('../models/Subject.js');
var Schedule = require('../models/Schedule.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Subject.find(req.query,function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Subject.create(req.body, function (err, post) {
    //if (err) return next(err);
    
    if (err) return res.status(500).json(err);
    
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Subject.findById(req.params.id, function (err, post) {
    if (err) return res.status(500).json(err);
    if (post == null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Subject.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Subject.findByIdAndRemove(req.params.id, function (err, success) {
    if (err) return res.status(500).json({message: "Não foi possível eliminar a disciplina"});
    Schedule.remove({subject: req.params.id}, function (err, success) {
      if (err) return res.status(500).json({message: "Não foi possível eliminar os horários da disciplina"});
      res.json(success);
    });
  });
})

module.exports = router;

