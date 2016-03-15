var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Absence = require('../models/Absence.js');
var User = require('../models/User.js');

/* POST /todos */
router.post('/', function(req, res, next) {
  Absence.create(req.body, function (err, post) {
    if (err) return next(err);
    
    res.json(post);
  });
});

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Absence.find(req.query,function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Absence.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    if (post == null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

module.exports = router;