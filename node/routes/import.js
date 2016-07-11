var express = require('express');
var passport = require('passport');
var pako = require('pako');
var generatePassword = require('password-generator');
var async = require("async");

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

function register(object, callback) {
    User.register(object, generatePassword(10), function(err, user) {
        if (err) return calback(err);

        Token.create({
            user: user._id
        }, function(err, token) {
            if (err) return calback(err);
            message.html = user.firstname + ' ' + user.lastname + '! Bem vindo/a ao Classbook! Clique no link abaixo para criar a sua senha: <br/><a href="http://www.classbook.co/#/page/reset/' + token._id + '">Activar Conta</a>';
            message.text = user.firstname + ' ' + user.lastname + '! Bem vindo ao Classbook! Clique no link para criar a sua senha: http://www.classbook.co/#/page/reset/' + token._id;
            message.to = user.email;
            message.toname = user.firstname + ' ' + user.lastname;
            sendgrid.send(message, function(err, result) {
                if (err) {
                    if (err) return calback(err);
                }
                //res.json(token);
                delete user.hash;
                delete user.salt;
                return calback(null, user);
            });
        });
    });
}

router.post('/', function(req, res, next) {

    if (!req.isAuthenticated()) {
        res.status(401).send();
    }

    var school = req.body.school;
    var user = req.user._id;
    var data = pako.ungzip(req.body.data);
    var errors;
    var i, j, k, temp;

    Course.insertMany(data.courses, function(err, courses) {
        if (err) {
            return res.status(500).json(err);
        }
        Group.insertMany(data.groups, function(err, groups) {
            if (err) {
                return res.status(500).json(err);
            }

            for (i = 0; i < data.subjects.length; i++) {
                var name = data.subjects[i].course;

                for (j = 0; j < courses.length; j++) {
                    if ($courses[j].name == name) {
                        data.subjects[i].course = $courses[j]._id;
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
                if (err) {
                    return res.status(500).json(err);
                }

                async.map(data.professors, register, function(err, professors) {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    var temp_absences;
                    for (i = 0; i < data.schedules.length; i++) {
                        temp_absences.push(data.schedules[i].absences);
                        delete data.schedules[i].absences;

                        var professor = data.schedules[i].professor;
                        var subject = data.schedules[i].subject;
                        var course = data.schedules[i].course;
                        var group = data.schedules[i].group;

                        for (j = 0; j < professors.length; j++) {
                            if ($professors[j].phone == professor) {
                                data.schedules[i].professor = $professors[j]._id;
                            }
                        }

                        for (j = 0; j < courses.length; j++) {
                            if ($courses[j].name == course) {
                                data.schedules[i].course = $courses[j]._id;
                            }
                        }

                        for (j = 0; j < subjects.length; j++) {
                            if ($subjects[j].name == subject) {
                                data.schedules[i].subject = $subjects[j]._id;
                            }
                        }

                        for (j = 0; j < groups.length; j++) {
                            if ($groups[j].name == group) {
                                data.schedules[i].group = $groups[j]._id;
                            }
                        }

                        if (data.schedules[i].professor == professor || data.schedules[i].subject == subject || data.schedules[i].course == course || data.schedules[i].group == group) {
                            temp = data.schedules.splice(i, 1);
                            errors.push({
                                type: 'schedule',
                                object: temp[0],
                                reason: 'O curso, disciplina, turma ou professor não foram encontrados'
                            });
                        }
                    }

                    Schedule.insertMany(data.schedules, function(err, schedules) {
                        if (err) {
                            return res.status(500).json(err);
                        }

                        var course = data.students[i].course;
                        var group = data.students[i].group;

                        for (j = 0; j < courses.length; j++) {
                            if ($courses[j].name == course) {
                                data.students[i].course = $courses[j]._id;
                            }
                        }

                        for (j = 0; j < groups.length; j++) {
                            if ($groups[j].name == group) {
                                data.students[i].group = $groups[j]._id;
                            }
                        }

                        if (data.students[i].course == course || data.students[i].group == group) {
                            temp = data.students.splice(i, 1);
                            errors.push({
                                type: 'student',
                                object: temp[0],
                                reason: 'O curso ou turma não foram encontrados'
                            });
                        }

                        User.insertMany(data.students, function(err, students) {
                            if (err) {
                                return res.status(500).json(err);
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



    res.json(post);
});

module.exports = router;