(function() {
    'use strict';
    var api = 'https://classbook.co:3002';
    angular.module('app.service')
        .factory("StatsService", ["$resource", "$q", "StorageService", "CourseService", "UserService", "SchoolService", "SubjectService", "ScheduleService", "SessionService", "AbsenceService",
            function($resource, $q, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService) {
                var stats = {};
                var users = [];
                var students = 0;
                var professors = 0;
                var admins = 0;
                var users_by_id = {};
                var schools = [];
                var subjects = [];
                var courses = [];
                var schedules = [];
                var absences = [];
                var professor_absences = [];
                var student_absences = [];
                var sessions = [];

                StorageService.load();

                var temp = StorageService.users();
                if (typeof temp != 'undefined') {
                    users = temp;
                }

                //console.log('users',users);

                for (var i = 0; i < users.length; i++) {
                    if (users[i].type == 'student') {
                        students += 1;
                    }
                    if (users[i].type == 'professor') {
                        professors += 1;
                    }
                    if (users[i].type == 'admin') {
                        admins += 1;
                    }
                }

                users_by_id = StorageService.users_by_id();
                schools = StorageService.schools();
                subjects = StorageService.subjects();
                courses = StorageService.courses();
                schedules = StorageService.schedules();
                absences = [];
                professor_absences = [];
                student_absences = [];
                sessions = [];
                SessionService.query({}, function(response) {
                    sessions = response;
                });
                AbsenceService.query({}, function(response) {
                    absences = response;
                    for (var i = 0; i < absences.length; i++) {
                        var user = users_by_id[absences[i].user];
                        //console.log(users_by_id);
                        //console.log(response[i].user);
                        if (user.type == 'student') {
                            student_absences.push(absences[i]);
                        }
                        if (user.type == 'professor') {
                            professor_absences.push(absences[i]);
                        }
                        //if(response[i].){}
                    }
                });


                stats.users = function() {
                    return users.length;
                };
                stats.students = function() {
                    return students;
                };
                stats.professors = function() {
                    return professors;
                };
                stats.schools = function() {
                    return schools.length;
                };
                stats.admins = function() {
                    return admins;
                };
                stats.absences = function() {
                    return absences.length;
                };
                stats.professor_absences = function() {
                    return professor_absences.length;
                };
                stats.student_absences = function() {
                    return student_absences.length;
                };
                stats.sessions = function() {
                    return sessions.length;
                };
                stats.courses = function() {
                    return courses.length;
                };
                stats.subjects = function() {
                    return subjects.length;
                };

                stats.school_users = function(id) {
                    var school_users = 0;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].school == id) {
                            school_users += 1;
                        }
                    }
                    return school_users;
                };
                stats.school_students = function(id) {
                    var school_users = 0;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].school == id && users[i].type == 'student') {
                            school_users += 1;
                        }
                    }
                    return school_users;
                };
                stats.school_professors = function(id) {
                    var school_users = 0;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].school == id && users[i].type == 'professor') {
                            school_users += 1;
                        }
                    }
                    return school_users;
                };
                stats.school_absences = function(id) {
                    var result = 0;
                    for (var i = 0; i < absences.length; i++) {
                        if (absences[i].school == id) {
                            result += 1;
                        }
                    }
                    return result;
                };
                stats.school_professor_absences = function(id) {
                    var result = 0;
                    for (var i = 0; i < professor_absences.length; i++) {
                        if (professor_absences[i].school == id) {
                            result += 1;
                        }
                    }
                    return result;
                };
                stats.school_student_absences = function(id) {
                    var result = 0;
                    for (var i = 0; i < student_absences.length; i++) {
                        if (student_absences[i].school == id) {
                            result += 1;
                        }
                    }
                    return result;
                };
                stats.school_sessions = function(id) {
                    var result = 0;
                    for (var i = 0; i < sessions.length; i++) {
                        if (sessions[i].school == id) {
                            result += 1;
                        }
                    }
                    return result;
                };
                stats.school_courses = function(id) {
                    var result = 0;
                    for (var i = 0; i < courses.length; i++) {
                        if (courses[i].school == id) {
                            result += 1;
                        }
                    }
                    return result;
                };
                stats.school_subjects = function(id) {
                    var result = 0;
                    for (var i = 0; i < subjects.length; i++) {
                        if (subjects[i].school == id) {
                            result += 1;
                        }
                    }
                    return result;
                };

                return stats;
            }
        ]);
})();