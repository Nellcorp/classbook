var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Class = require('../models/Class.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Class.find(function (err, classes) {
    if (err) return next(err);
    res.json(classes);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  req.body.schedule = {
    monday: {start: req.body.monday_start, end: req.body.monday_end},
    tuesday: {start: req.body.tuesday_start, end: req.body.tuesday_end},
    wednesday: {start: req.body.wednesday_start, end: req.body.wednesday_end},
    thursday: {start: req.body.thursday_start, end: req.body.thursday_end},
    friday: {start: req.body.friday_start, end: req.body.friday_end},
    saturday: {start: req.body.saturday_start, end: req.body.saturday_end}
  };
    
  Class.create(req.body, function (err, post) {
    if (err) return next(err);
    
    res.json(req.body);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Class.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Class.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Class.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
})

module.exports = router;

