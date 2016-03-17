/*
In order to run the beast in your terminal:

pm2 start server.js
pm2 start worker.js -i 4

We launch the server and then the workers.
In that case we decide to launch 4 workers because we have 4 cores.
PM2 can anyway detect the number of cores for you.
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var kue = require('kue');
var Absence = require('../models/Absence.js');
var User = require('../models/User.js');

//console.log(process.env.redis_pass);

var jobs = kue.createQueue({
  prefix: 'q',
  jobEvents: false,
  redis: {
    port: 6379,
    host: process.env.redis_host,
    auth: process.env.redis_pass,
    options: { /* see https://github.com/mranney/node_redis#rediscreateclient */}
  }
});

jobs
  .on('job enqueue', function(id, type){
    console.log( 'Enqueued %s job %s', type, id );
})
  .on('job failed', function(id, type){
    console.log( '%s job %s failed', type, id );
})
  .on('job complete', function(id, result){
    kue.Job.get(id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('Removed complete absence notification job #%d', job.id);
      });
    });
  });

/* POST /todos */
router.post('/', function(req, res, next) {
  
  Absence.create(req.body, function (err, post) {
    if (err) return next(err);

    var user_job = jobs.create('absence notification', {
        phone: req.body.phone,
        message: req.body.message
      }).removeOnComplete(true).save();

    var supervisor_job = jobs.create('absence notification', {
        phone: req.body.supervisor_phone,
        message: req.body.supervisor_message
      }).removeOnComplete(true).save();

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