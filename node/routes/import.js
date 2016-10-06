var express = require('express');
var passport = require('passport');
var pako = require('pako');
var moment = require('moment');
var momentz = require('moment-timezone');
var generatePassword = require('password-generator');
var async = require("async");
var kue = require('kue');
var ucfirst = require('ucfirst');

var sendgrid = require('sendgrid')(process.env.sendgrid_key);

var message = {
    from: 'noreply@classbook.co',
    fromname: 'Classbook',
    subject: 'Notificação Classbook'
};

var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Session = require('../models/Session.js');
var Schedule = require('../models/Schedule.js');
var Absence = require('../models/Absence.js');
var Subject = require('../models/Subject.js');
var Course = require('../models/Course.js');
var School = require('../models/School.js');
var Group = require('../models/Group.js');
var Token = require('../models/Token.js');


var jobs = kue.createQueue({
    prefix: 'q',
    jobEvents: false,
    redis: {
        port: 6379,
        host: process.env.redis_host,
        auth: process.env.redis_pass,
        options: { /* see https://github.com/mranney/node_redis#rediscreateclient */ }
    }
});

jobs
    .on('job enqueue', function(id, type) {
        console.log('Enqueued %s job %s', type, id);
    })
    .on('job failed', function(id, type) {
        console.log('%s job %s failed', type, id);
    })
    .on('error', function(err) {
        console.log('Queue Error... ', err);
    })
    .on('job complete', function(id, result) {
        kue.Job.get(id, function(err, job) {
            if (err) return;
            job.remove(function(err) {
                if (err) throw err;
                console.log('Removed complete absence notification job #%d', job.id);
            });
        });
    });

function register(object, callback) {
    User.register(object, generatePassword(10), function(err, user) {
        if (err) return callback(err);

        Token.create({
            user: user._id
        }, function(err, token) {
            if (err) return callback(err);
            message.html = ucfirst(user.firstname) + ' ' + ucfirst(user.lastname) + '! Bem vindo/a ao Classbook! Clique no link abaixo para criar a sua senha: <br/><a href="http://www.classbook.co/#/page/activate/' + token._id + '">Activar Conta</a>';
            message.text = ucfirst(user.firstname) + ' ' + ucfirst(user.lastname) + '! Bem vindo ao Classbook! Clique no link para criar a sua senha: http://www.classbook.co/#/page/activate/' + token._id;
            message.to = user.email;
            message.toname = user.firstname + ' ' + user.lastname;
            sendgrid.send(message, function(err, result) {
                if (err) {
                    if (err) return callback(err);
                }
                //res.json(token);
                delete user.hash;
                delete user.salt;
                return callback(null, user);
            });
        });
    });
}

router.post('/', function(req, res, next) {

    if (!req.isAuthenticated()) {
        res.status(401).send();
    }

    //var school = req.body.school;
    //console.log(req.body.data);
    var user = req.user._id;
    //var data = pako.ungzip(req.body.data);
    var data = req.body.data;
    //var data = JSON.parse(pako.inflate(req.body, { to: 'string' }));
    //console.log(data);

    var errors = [];
    var i, j, k, l, temp;

    Course.insertMany(data.courses, function(err, courses) {
        if (err && data.courses.length > 0) {
            console.log(err);
            next(err);
            return;
        }
        Group.insertMany(data.groups, function(err, groups) {
            if (err && data.groups.length > 0) {
                console.log(err);
                next(err);
                return;
            }

            for (i = 0; i < data.subjects.length; i++) {
                var name = data.subjects[i].course;

                if (data.subjects[i].hasOwnProperty('course_id')) {
                    data.subjects[i].course = data.subjects[i].course_id;
                    delete data.subjects[i].course_id;
                } else {
                    for (j = 0; j < courses.length; j++) {
                        if (courses[j].name == name) {
                            data.subjects[i].course = courses[j]._id;
                        }
                    }
                }
                if (data.subjects[i].course == name) {
                    temp = data.subjects.splice(i, 1);
                    errors.push({
                        type: 'subject',
                        object: temp[0],
                        reason: 'O curso ' + name + ' não foi encontrado'
                    });
                }
            }

            Subject.insertMany(data.subjects, function(err, subjects) {
                if (err && data.subjects.length > 0) {
                    console.log(err);
                    next(err);
                    return;
                }

                async.map(data.professors, register, function(err, professors) {
                    if (err) {
                        console.log(err);
                        next(err);
                        return;
                    }

                    var temp_absences = [];
                    for (i = data.schedules.length - 1; i >= 0; i--) {

                        var professor = data.schedules[i].professor;
                        var subject = data.schedules[i].subject;
                        var course = data.schedules[i].course;
                        var group = data.schedules[i].group;

                        if (data.schedules[i].hasOwnProperty('professor_id')) {
                            data.schedules[i].professor = data.schedules[i].professor_id;
                            delete data.schedules[i].professor_id;
                        } else {
                            for (j = 0; j < professors.length; j++) {
                                if (professors[j].phone == professor) {
                                    data.schedules[i].professor = professors[j]._id;
                                }
                            }
                        }

                        if (data.schedules[i].hasOwnProperty('course_id')) {
                            data.schedules[i].course = data.schedules[i].course_id;
                            delete data.schedules[i].course_id;
                        } else {
                            for (j = 0; j < courses.length; j++) {
                                if (courses[j].name == course) {
                                    data.schedules[i].course = courses[j]._id;
                                }
                            }
                        }

                        if (data.schedules[i].hasOwnProperty('subject_id')) {
                            data.schedules[i].subject = data.schedules[i].subject_id;
                            delete data.schedules[i].subject_id;
                        } else {
                            for (j = 0; j < subjects.length; j++) {
                                if (subjects[j].name == subject) {
                                    data.schedules[i].subject = subjects[j]._id;
                                }
                            }
                        }

                        if (data.schedules[i].hasOwnProperty('group_id')) {
                            data.schedules[i].group = data.schedules[i].group_id;
                            delete data.schedules[i].group_id;
                        } else {
                            for (j = 0; j < groups.length; j++) {
                                if (groups[j].name == group) {
                                    data.schedules[i].group = groups[j]._id;
                                }
                            }
                        }

                        if (data.schedules[i].professor == professor || data.schedules[i].subject == subject || data.schedules[i].course == course || data.schedules[i].group == group) {
                            temp = data.schedules.splice(i, 1);
                            errors.push({
                                type: 'schedule',
                                object: temp[0],
                                reason: 'O curso, disciplina, turma ou professor não foram encontrados'
                            });
                        } else {
                            for (var k = 0; k < data.schedules[i].absences.length; k++) {
                                data.schedules[i].absences[k].course = data.schedules[i].course;
                                data.schedules[i].absences[k].subject = data.schedules[i].subject;
                                data.schedules[i].absences[k].professor = data.schedules[i].professor;
                            }
                            temp_absences.push(data.schedules[i].absences);
                            delete data.schedules[i].absences;
                        }
                    }

                    Schedule.insertMany(data.schedules, function(err, schedules) {
                        if (err && data.schedules.length > 0) {
                            console.log(err);
                            next(err);
                            return;
                        }

                        for (i = 0; i < temp_absences.length; i++) {
                            var temp_absence = temp_absences[i];
                            //console.log(temp_absence);
                            for (k = 0; k < temp_absence.length; k++) {
                                for (j = 0; j < temp_absence[k].time.length; j++) {
                                    var start = moment(new Date(temp_absence[k].time[j].start)).tz('Africa/Luanda');
                                    var delay = start.add(temp_absence[k].time[j].late, 'minutes');
                                    var today = moment(new Date()).tz('Africa/Luanda');

                                    if (today.isAfter(start)) {
                                        continue;
                                    }

                                    var schedule = temp_absence[k].schedule;

                                    for (l = 0; l < schedules.length; l++) {
                                        if (schedules[l].subject == temp_absence[k].subject && schedules[l].course == temp_absence[k].course && schedules[l].professor == temp_absence[k].professor) {
                                            schedule = schedules[l]._id;
                                        }
                                    }
                                    var job = jobs.create('absence check', {
                                        user: temp_absence[k].professor,
                                        phone: temp_absence[k].phone,
                                        school: temp_absence[k].school,
                                        course: temp_absence[k].course,
                                        year: temp_absence[k].year,
                                        subject: temp_absence[k].subject,
                                        schedule: schedule,
                                        time: temp_absence[k].time[j],
                                        start: start.format(),
                                        message: temp_absence[k].time[j].message,
                                        supervisor_phone: temp_absence[k].supervisor_phone,
                                        supervisor_message: temp_absence[k].time[j].supervisor_message,
                                    }).delay(delay.toDate()).removeOnComplete(true).save();
                                }
                            }
                        }

                        for (i = data.students.length - 1; i >= 0; i--) {

                            var course = data.students[i].course;
                            var group = data.students[i].group;

                            if (data.students[i].hasOwnProperty('course_id')) {
                                data.students[i].course = data.students[i].course_id;
                                delete data.students[i].course_id;
                            } else {
                                for (j = 0; j < courses.length; j++) {
                                    if (courses[j].name == course) {
                                        data.students[i].course = courses[j]._id;
                                    }
                                }
                            }

                            if (data.students[i].hasOwnProperty('group_id')) {
                                data.students[i].group = data.students[i].group_id;
                                delete data.students[i].group_id;
                            } else {
                                for (j = 0; j < groups.length; j++) {
                                    if (groups[j].name == group) {
                                        data.students[i].group = groups[j]._id;
                                    }
                                }
                            }
                            if (data.students[i].course == course || data.students[i].group == group) {
                                temp = data.students.splice(i, 1);
                            }
                        }

                        User.insertMany(data.students, function(err, students) {
                            if (err && data.students.length > 0) {
                                console.log(err);
                                next(err);
                                return;
                            }
                            res.json({
                                result: 'Informação importada com sucesso'
                            });
                        });
                    });
                });
            });
        });
    });
    /*
    res.status(500).json({
        result: 'A importação falhou. Por favor tente novamente.',
        errors: errors
    });
    */
});

module.exports = router;