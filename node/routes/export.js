var express = require('express');
var passport = require('passport');
var router = express.Router();
var async = require("async");

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Session = require('../models/Session.js');
var Schedule = require('../models/Schedule.js');
var Subject = require('../models/Subject.js');
var Course = require('../models/Course.js');
var School = require('../models/School.js');
var Group = require('../models/Group.js');
var Absence = require('../models/Absence.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {

    if (!req.isAuthenticated()) {
        res.status(401).send();
    }

    var data = {
        users: [],
        courses: [],
        subjects: [],
        groups: [],
        schedules: [],
        school: []
    };

    async.forEachOf(data, function(value, key, callback) {
        if (key == 'users') {
            User.find({
                school: req.user.school
            }, function(err, result) {
                if (err) return callback(err);
                data[key] = result;
                callback();
            });
        }

        if (key == 'courses') {
            Course.find({
                school: req.user.school
            }, function(err, result) {
                if (err) return callback(err);
                data[key] = result;
                callback();
            });
        }

        if (key == 'subjects') {
            Subject.find({
                school: req.user.school
            }, function(err, result) {
                if (err) return callback(err);
                data[key] = result;
                callback();
            });
        }

        if (key == 'groups') {
            Group.find({
                school: req.user.school
            }, function(err, result) {
                if (err) return callback(err);
                data[key] = result;
                callback();
            });
        }

        if (key == 'schedules') {
            Schedule.find({
                school: req.user.school
            }, function(err, result) {
                if (err) return callback(err);
                data[key] = result;
                callback();
            });
        }

        if (key == 'school') {
            School.findById(req.user.school, function(err, result) {
                if (err) return callback(err);
                data[key] = result;
                callback();
            });
        }
    }, function(err) {
        if (err) res.status(500).send();
        // configs is now a map of JSON data
        res.status(200).send(data);
    });

});

module.exports = router;