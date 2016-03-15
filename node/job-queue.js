var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Absence = require('../models/Absence.js');
var kue = require('kue');
var jobs = kue.createQueue();
//kue.app.listen(3003);
var nexmo = require('easynexmo');
var key = process.env.nexmokey;
var secret = process.env.nexmosecret;
var sender = process.env.nexmosender;

nexmo.initialize(key, secret, false);

function smsJob (name, data){
  name = name || 'Default_Name';
  var job = jobs.create('sms job', data);

  job
    .on('complete', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'is done');
    })
    .on('failed', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'has failed');
    })

  job.removeOnComplete( true ).save();
}

jobs.process('sms job', function (job, done){
  /* carry out all the job function here */

  sendSMS ('+244'+job.data.phone, job.data.message, function (err,response) {
       if (err) {
            console.log(err);
       } else {
            //console.log('Job', job.id, 'is done');
            console.dir(response);
       }
});
  done && done();
});

function sendSMS (recipient, message, callback){

  var options = { host: 'rest.nexmo.com', path: '/sms/json', port: 443, method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
};
  nexmo.sendTextMessage(sender,recipient,message,false, callback );
}

setInterval(function (){ smsJob('Send_Text');}, 3000);