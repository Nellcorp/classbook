var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Group = require('../models/Group.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Group.find(req.query,function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
    
  Group.create(req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Group.findById(req.params.id, function (err, post) {
    if (err) return res.status(500).json(err);
    if (post == null) return res.status(404).json({ error: "Resource Not found." });
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Group.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return res.status(500).json(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Group.findByIdAndRemove(req.params.id, function (err, success) {
    if (err) return res.status(500).json({message: "Não foi possível eliminar a turma"});
    res.json(success); });
})

module.exports = router;

