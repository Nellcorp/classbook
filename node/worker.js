/*
In order to run the beast in your terminal:

pm2 start server.js
pm2 start worker.js -i 4

We launch the server and then the workers.
In that case we decide to launch 4 workers because we have 4 cores.
PM2 can anyway detect the number of cores for you.
*/
var express = require('express');
var mongoose = require('mongoose');
var Absence = require('./models/Absence.js');
var Session = require('./models/Session.js');
var User = require('./models/User.js');

var kue = require('kue');
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

var port = process.env.port_worker;
kue.app.set('title', 'Classbook');
//kue.app.listen(port);

var nexmo = require('easynexmo');
var key = process.env.nexmokey;
var secret = process.env.nexmosecret;
var sender = process.env.nexmosender;

nexmo.initialize(key, secret, false);

jobs.process('absence notification', function (job, done){
  /* carry out all the job function here */

  sendSMS ('+244'+job.data.phone, job.data.message, function (err,response) {
       if (err) {
            console.log(err);
       } else {
            console.dir(response);
       }
});
  done && done();
});

jobs.process('absence check', function (job, done){
  
        var temp = new Date();
        
        var offset = -60;

        if(temp.getTimezoneOffset() == offset){
            var d = temp;    
        }else{
            var utc = temp.getTime() + (temp.getTimezoneOffset() * 60000);
            var d = new Date(utc - (3600000*offset));
        }

         var locale = d.toLocaleString();

        
  Session.find({schedule: job.data.schedule, start: job.data.time.start},function (err, sessions) {
    if (err){
      job.remove(function(error){
        if (error) return next(error);
        console.log('Removed orphan job #%d', job.id); });
        done && done();
    }
    if(sessions.length == 0 ){
        var sessionData = {
            title: job.data.subject,
            schedule: job.data.schedule,
            summary: 'Aula não dada por falta do professor',
            start: job.data.time.start,
            end: job.data.time.end,
            started: job.data.time.start,
            missing: [job.data.user]
        };

      Session.create(sessionData, function (err, session) {
        if (err) return next(err);
        var absence = {
            user: job.data.user,
            phone: job.data.phone,
            school: job.data.school,
            year: job.data.year,
            schedule: job.data.schedule,
            course: job.data.course,
            subject: job.data.subject,
            session: session._id,
            message: job.data.message,
            supervisor_phone: job.data.supervisor_phone,
            supervisor_message: job.data.supervisor_message,
            time: locale
        };
        
        Absence.create(absence, function (err, post) {
          if (err) return next(err);

          var user_job = jobs.create('absence notification', {
            phone: absence.phone,
            message: absence.message
          }).removeOnComplete(true).save();

          var supervisor_job = jobs.create('absence notification', {
            phone: absence.supervisor_phone,
            message: absence.supervisor_message
          }).removeOnComplete(true).save();

          done && done();
      }); 

    });

  }
});
  
});

function sendSMS (recipient, message, callback){

  var options = { host: 'rest.nexmo.com', path: '/sms/json', port: 443, method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(recipient + message) }
};
  nexmo.sendTextMessage(sender,recipient,message,false, callback );
}