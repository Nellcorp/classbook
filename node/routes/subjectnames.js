var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var SubjectName = require('../models/SubjectName.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  SubjectName.find(req.query,function (err, post) {
    if (err) res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  SubjectName.create(req.body, function (err, post) {
    if (err) res.status(500).json(err);
    
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  SubjectName.findById(req.params.id, function (err, post) {
    if (err) res.status(500).json(err);
    if (post == null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  SubjectName.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  SubjectName.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) res.status(500).json(err);
    res.json(post);
  });
})

module.exports = router;

