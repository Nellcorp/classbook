var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Subject = require('../models/Subject.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Subject.find(function (err, subjects) {
    if (err) return next(err);
    res.json(subjects);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Subject.create(req.body, function (err, post) {
    if (err) return next(err);
    
    res.json(req.body);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Subject.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Subject.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Subject.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
})

module.exports = router;
