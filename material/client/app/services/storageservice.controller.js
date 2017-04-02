(function() {
    'use strict';
    var api = 'https://classbook.co:3002';
    angular.module('app.service')
        .config(['$localStorageProvider',
            function($localStorageProvider) {
                $localStorageProvider.setKeyPrefix('classbook-');
            }
        ])
        .config(['$sessionStorageProvider',
            function($sessionStorageProvider) {
                $sessionStorageProvider.setKeyPrefix('classbook-');
            }
        ])
        .factory("StorageService", ["$resource", "$q", "$cookies", "$sessionStorage", "CourseService", "UserService", "SchoolService", "SubjectService", "ScheduleService", "ErrorService",
            function($resource, $q, $cookies, $sessionStorage, CourseService, UserService, SchoolService, SubjectService, ScheduleService, ErrorService) {
                var session = {};
                var user = $cookies.getObject('user');
                session.load = function() {
                    if (typeof $sessionStorage.schools == 'undefined') {
                        $sessionStorage.schools = [];
                    }
                    if (typeof $sessionStorage.courses == 'undefined') {
                        $sessionStorage.courses = [];
                    }
                    if (typeof $sessionStorage.users == 'undefined') {
                        $sessionStorage.users = [];
                    }
                    if (typeof $sessionStorage.subjects == 'undefined') {
                        $sessionStorage.subjects = [];
                    }

                    var promises = [];
                    if (!!user) {
                        if (user.type == 'admin') {
                            //console.log(JSON.stringify(response));
                            $sessionStorage.schedules = [];
                            SchoolService.query({}, function(response) {
                                $sessionStorage.schools = response;
                                CourseService.query({}, function(response) {
                                    $sessionStorage.courses = response;
                                    SubjectService.query({}, function(response) {
                                        $sessionStorage.subjects = response;
                                        UserService.query({}, function(response) {
                                            $sessionStorage.users = response;
                                            return response;
                                        });
                                    });
                                });
                            });
                        } else if (user.type == 'manager' || user.type == 'professor' || user.type == 'student') {
                            SchoolService.get({
                                id: user.school
                            }, function(response) {
                                $sessionStorage.schools = [response];
                                CourseService.query({
                                    school: user.school
                                }, function(response) {
                                    $sessionStorage.courses = response;
                                    SubjectService.query({
                                        school: user.school
                                    }, function(response) {
                                        $sessionStorage.subjects = response;
                                        UserService.query({
                                            school: user.school
                                        }, function(response) {
                                            $sessionStorage.users = response;
                                            ScheduleService.query({
                                                school: user.school
                                            }, function(response) {
                                                $sessionStorage.schedules = response;
                                                return response;
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    }
                };

                session.clear = function() {
                    $sessionStorage.$reset();
                };

                session.me = function() {
                    return user;
                };

                session.error = function(error) {
                    return ErrorService.parse(error);
                };

                session.isEmpty = function() {
                    if (!!$sessionStorage.schools && !!$sessionStorage.courses && !!$sessionStorage.subjects && !!$sessionStorage.users) {
                        return false;
                    }
                    return true;
                };

                session.schools = function() {
                    return $sessionStorage.schools;
                };
                session.courses = function() {
                    return $sessionStorage.courses;
                };
                session.subjects = function() {
                    return $sessionStorage.subjects;
                };
                session.users = function() {
                    return $sessionStorage.users;
                };
                session.schedules = function() {
                    return $sessionStorage.schedules;
                };

                session.courses_by_name = function() {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.courses.length; i++) {
                        result[$sessionStorage.courses[i].name] = $sessionStorage.courses[i];
                    }
                    return result;
                };

                session.courses_by_id = function() {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.courses.length; i++) {
                        result[$sessionStorage.courses[i]._id] = $sessionStorage.courses[i];
                    }
                    return result;
                };

                session.course_by_id = function(id) {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.courses.length; i++) {
                        if ($sessionStorage.courses[i]._id == id) {
                            return $sessionStorage.courses[i];
                        }
                    }
                    return false;
                };

                session.subject_by_id = function(id) {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.subjects.length; i++) {
                        if ($sessionStorage.subjects[i]._id == id) {
                            return $sessionStorage.subjects[i];
                        }
                    }
                    return false;
                };

                session.schedule_by_id = function(id) {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.schedules.length; i++) {
                        if ($sessionStorage.schedules[i]._id == id) {
                            return $sessionStorage.schedules[i];
                        }
                    }
                    return false;
                };

                session.subjects_by_name = function() {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.subjects.length; i++) {
                        result[$sessionStorage.subjects[i].course + '_' + $sessionStorage.subjects[i].name] = $sessionStorage.subjects[i];
                    }
                    return result;
                };

                session.subjects_by_coursename = function() {
                    var result = {};
                    var courses = session.courses_by_id();
                    for (var i = 0; i < $sessionStorage.subjects.length; i++) {
                        result[courses[$sessionStorage.subjects[i].course].name + '_' + $sessionStorage.subjects[i].name] = $sessionStorage.subjects[i];
                    }
                    return result;
                };

                session.users_by_phone = function() {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.users.length; i++) {
                        result[$sessionStorage.users[i].phone] = $sessionStorage.users[i];
                    }
                    return result;
                };

                session.users_by_email = function() {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.users.length; i++) {
                        result[$sessionStorage.users[i].email] = $sessionStorage.users[i];
                    }
                    return result;
                };

                session.school_by_id = function(id) {
                    var result = {};
                    for (var i = 0; i < $sessionStorage.schools.length; i++) {
                        if ($sessionStorage.schools[i]._id == id) {
                            return $sessionStorage.schools[i];
                        }
                    }
                    return false;
                };

                session.user_by_id = function(id) {
                    for (var i = 0; i < $sessionStorage.users.length; i++) {
                        if ($sessionStorage.users[i]._id == id) {
                            return $sessionStorage.users[i];
                        }
                    }
                    return false;
                };

                session.users_by_id = function() {
                    var result = {};
                    //console.log($sessionStorage.users);
                    for (var i = 0; i < $sessionStorage.users.length; i++) {
                        result[$sessionStorage.users[i]._id] = $sessionStorage.users[i];
                    }
                    return result;
                };

                session.schedules_by_user = function() {
                    var result = {};
                    //console.log($sessionStorage.schedules);
                    for (var i = 0; i < $sessionStorage.schedules.length; i++) {
                        if (result.hasOwnProperty($sessionStorage.schedules[i].professor)) {
                            result[$sessionStorage.schedules[i].professor].push($sessionStorage.schedules[i]);
                        } else {
                            result[$sessionStorage.schedules[i].professor] = [$sessionStorage.schedules[i]];
                        }
                    }
                    return result;
                };

                return session;

            }
        ]);
})();