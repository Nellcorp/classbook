/*
In order to run the beast in your terminal:

pm2 start server.js
pm2 start worker.js -i 4

We launch the server and then the workers.
In that case we decide to launch 4 workers because we have 4 cores.
PM2 can anyway detect the number of cores for you.
*/

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
kue.app.listen(port);

var nexmo = require('easynexmo');
var key = process.env.nexmokey;
var secret = process.env.nexmosecret;
var sender = process.env.nexmosender;

nexmo.initialize(key, secret, false);

jobs.process('absence notification', 4, function (job, done){
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

function sendSMS (recipient, message, callback){

  var options = { host: 'rest.nexmo.com', path: '/sms/json', port: 443, method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(recipient + message) }
};
  nexmo.sendTextMessage(sender,recipient,message,false, callback );
}