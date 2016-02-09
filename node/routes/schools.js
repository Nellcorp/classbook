var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var School = require('../models/School.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  School.find(function (err, schools) {
    if (err) return next(err);
    res.json(schools);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {

  req.body.director = {firstname: req.body.director_firstname, lastname: req.body.director_lastname, email: req.body.director_email, phone: req.body.director_phone};

  School.create(req.body, function (err, post) {
    if (err) return next(err);
    
    res.json(req.body);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  School.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  School.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  School.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
})

module.exports = router;

