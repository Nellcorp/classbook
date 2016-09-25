(function() {
    'use strict';

    angular.module('app.schedule')
        .controller('subjectScheduleCtrl', ['$scope', 'moment', '$location', 'UserService', 'SubjectService', 'ScheduleService', '$stateParams', subjectScheduleCtrl])
        .controller('schoolScheduleCtrl', ['$scope', 'moment', '$location', 'UserService', 'SubjectService', 'ScheduleService', 'SchoolService', 'StorageService', '$stateParams', schoolScheduleCtrl])
        .controller('profScheduleCtrl', ['$scope', 'moment', '$cookies', '$location', 'UserService', 'SubjectService', 'ScheduleService', 'GroupService', 'SessionService', '$stateParams', profScheduleCtrl])
        .controller('profScheduleCtrl_noID', ['$scope', 'moment', '$cookies', '$location', 'UserService', 'SubjectService', 'ScheduleService', 'GroupService', 'SessionService', '$stateParams', profScheduleCtrl_noID])
        .controller('scheduleCtrl', ['$scope', 'moment', '$location', 'UserService', 'SubjectService', 'ScheduleService', '$stateParams', scheduleCtrl]);

    function scheduleCtrl($scope, moment, $location, UserService, SubjectService, ScheduleService, $stateParams) {
        $scope.id = $stateParams.id;

        ScheduleService.get({
            id: $scope.id
        }, function(schedule) {
            $scope.schedule = schedule;
            SubjectService.get({
                id: $scope.schedule.subject
            }, function(subject) {
                $scope.subject = subject;
                UserService.get({
                    id: $scope.schedule.professor
                }, function(professor) {
                    $scope.professor = professor;
                    var orig_schedule = angular.copy($scope.schedule);

                    $scope.canSubmit = function() {
                        var validate = (($scope.schedule.schedule.monday.start < $scope.schedule.schedule.monday.end) || ($scope.schedule.schedule.monday.start == '0:00' && $scope.schedule.schedule.monday.end == '0:00')) &&
                            (($scope.schedule.schedule.tuesday.start < $scope.schedule.schedule.tuesday.end) || ($scope.schedule.schedule.tuesday.start == '0:00' && $scope.schedule.schedule.tuesday.end == '0:00')) &&
                            (($scope.schedule.schedule.wednesday.start < $scope.schedule.schedule.wednesday.end) || ($scope.schedule.schedule.wednesday.start == '0:00' && $scope.schedule.schedule.wednesday.end == '0:00')) &&
                            (($scope.schedule.schedule.thursday.start < $scope.schedule.schedule.thursday.end) || ($scope.schedule.schedule.thursday.start == '0:00' && $scope.schedule.schedule.thursday.end == '0:00')) &&
                            (($scope.schedule.schedule.friday.start < $scope.schedule.schedule.friday.end) || ($scope.schedule.schedule.friday.start == '0:00' && $scope.schedule.schedule.friday.end == '0:00'));

                        return $scope.userForm.$valid && !angular.equals($scope.schedule, orig_schedule) && validate;
                    };
                });
            });
        });

        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            ScheduleService.update({
                id: $scope.id
            }, $scope.schedule, function(schedule) {
                //console.log(response);
            });
        };
    }

    function subjectScheduleCtrl($scope, moment, $location, UserService, SubjectService, ScheduleService, $stateParams) {
        $scope.id = $stateParams.id;

        SubjectService.get({
            id: $scope.id
        }, function(subject) {
            $scope.subject = subject;

            ScheduleService.query({
                subject: $scope.id
            }, function(schedules) {

                UserService.query({
                    school: $scope.subject.school,
                    type: 'professor'
                }, function(professors) {
                    for (var i = 0; i < schedules.length; i++) {
                        for (var j = 0; j < professors.length; j++) {
                            if (schedules[i].professor == professors[j]._id) {
                                schedules[i].professor_name = professors[j].firstname + ' ' + professors[j].lastname;
                            }
                        }
                    }
                    $scope.schedules = schedules;
                });



                //console.log($scope.schedules[i]);
            });
        });

    }

    function schoolScheduleCtrl($scope, moment, $location, UserService, SubjectService, ScheduleService, SchoolService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;

        SchoolService.get({
            id: $scope.id
        }, function(school) {
            $scope.school = school;

            ScheduleService.query({
                school: $scope.id
            }, function(schedules) {

                UserService.query({
                    school: $scope.id,
                    type: 'professor'
                }, function(professors) {
                    for (var i = 0; i < schedules.length; i++) {
                        schedules[i].subject_name = StorageService.subject_by_id(schedules[i].subject).name;
                        for (var j = 0; j < professors.length; j++) {
                            if (schedules[i].professor == professors[j]._id) {
                                schedules[i].professor_name = professors[j].firstname + ' ' + professors[j].lastname;
                            }
                        }
                    }
                    $scope.schedules = schedules;
                });



                //console.log($scope.schedules[i]);
            });
        });

    }

    function profScheduleCtrl($scope, moment, $cookies, $location, UserService, SubjectService, ScheduleService, GroupService, SessionService, $stateParams) {
        //console.log($stateParams);
        //console.log(GroupService);
        $scope.id = $stateParams.id;
        $scope.schedules = [];
        //$scope.user = $cookies.getObject('user');

        $scope.weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        $scope.d = moment(new Date()).tz('Africa/Luanda');

        var year = $scope.d.year();
        var month = $scope.d.month();
        var day = $scope.d.date();
        var hours = $scope.d.hours();
        var min = $scope.d.minutes();
        $scope.weekday = $scope.weekdays[$scope.d.day()];
        //console.log($scope.weekday);


        $scope.late = 20;
        $scope.early = 10;
        //$scope.late = 36000;
        //$scope.early = 36000;

        UserService.get({
            id: $scope.id
        }, function(user) {
            $scope.user = user;

            ScheduleService.query({
                professor: $scope.id
            }, function(schedules) {
                SubjectService.query({
                    school: $scope.user.school
                }, function(subjects) {
                    GroupService.query({
                        school: $scope.user.school
                    }, function(groups) {

                        for (var i = 0; i < schedules.length; i++) {
                            for (var j = 0; j < subjects.length; j++) {
                                if (schedules[i].subject == subjects[j]._id) {
                                    schedules[i].subject_name = subjects[j].name;
                                    schedules[i].start = moment(new Date(subjects[j].semester.start)).tz('Africa/Luanda');
                                    schedules[i].end = moment(new Date(subjects[j].semester.end)).tz('Africa/Luanda');
                                    schedules[i].show = true;
                                    if ($scope.d.isAfter(schedules[i].end) || $scope.d.isBefore(schedules[i].start)) {
                                        schedules[i].show = false;
                                    }
                                }
                            }

                            for (j = 0; j < groups.length; j++) {
                                if (schedules[i].group == groups[j]._id) {
                                    schedules[i].group_name = groups[j].name;
                                }
                            }
                        }

                        for (i = 0; i < schedules.length; i++) {
                            if (schedules[i].show) {
                                schedules[i].start = schedules[i].start.toDate();
                                schedules[i].end = schedules[i].end.toDate();
                                $scope.schedules.push(schedules[i]);
                            }
                        }
                    });
                });
                //console.log($scope.schedules[i]);
            });
        });

    }

    function profScheduleCtrl_noID($scope, moment, $cookies, $location, UserService, SubjectService, ScheduleService, GroupService, SessionService, $stateParams) {
        $scope.id = $cookies.getObject('user').id;
        //$scope.user = $cookies.getObject('user');
        //console.log('User: ',$scope.id);
        $scope.schedules = [];
        //$scope.user = $cookies.getObject('user');

        $scope.weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        $scope.d = moment(new Date()).tz('Africa/Luanda');

        var year = $scope.d.year();
        var month = $scope.d.month();
        var day = $scope.d.date();
        var hours = $scope.d.hours();
        var min = $scope.d.minutes();
        $scope.weekday = $scope.weekdays[$scope.d.day()];
        //console.log($scope.weekday);


        $scope.late = 20;
        $scope.early = 10;


        UserService.get({
            id: $scope.id
        }, function(user) {
            $scope.user = user;

            ScheduleService.query({
                professor: $scope.id
            }, function(schedules) {

                SubjectService.query({
                    school: $scope.user.school
                }, function(subjects) {
                    GroupService.query({
                        school: $scope.user.school
                    }, function(groups) {
                        SessionService.query({
                            professor: $scope.id
                        }, function(sessions) {
                            for (var i = 0; i < schedules.length; i++) {
                                for (var j = 0; j < subjects.length; j++) {
                                    if (schedules[i].subject == subjects[j]._id) {
                                        schedules[i].subject_name = subjects[j].name;
                                        schedules[i].start = moment(new Date(subjects[j].semester.start)).tz('Africa/Luanda');
                                        schedules[i].end = moment(new Date(subjects[j].semester.end)).tz('Africa/Luanda');
                                        schedules[i].show = true;
                                        if ($scope.d.isAfter(schedules[i].end) || $scope.d.isBefore(schedules[i].start)) {
                                            schedules[i].show = false;
                                        }

                                    }
                                }

                                for (j = 0; j < groups.length; j++) {
                                    if (schedules[i].group == groups[j]._id) {
                                        schedules[i].group_name = groups[j].name;
                                    }
                                }

                                schedules[i].schedule.monday.show = false;
                                schedules[i].schedule.monday.hide = false;
                                schedules[i].schedule.tuesday.show = false;
                                schedules[i].schedule.tuesday.hide = false;
                                schedules[i].schedule.wednesday.show = false;
                                schedules[i].schedule.wednesday.hide = false;
                                schedules[i].schedule.thursday.show = false;
                                schedules[i].schedule.thursday.hide = false;
                                schedules[i].schedule.friday.show = false;
                                schedules[i].schedule.friday.hide = false;

                                if (schedules[i].schedule.monday.start == '0:00' || schedules[i].schedule.monday.end == '0:00') {
                                    schedules[i].schedule.monday.hide = true;
                                }
                                if (schedules[i].schedule.tuesday.start == '0:00' || schedules[i].schedule.tuesday.end == '0:00') {
                                    schedules[i].schedule.tuesday.hide = true;
                                }
                                if (schedules[i].schedule.wednesday.start == '0:00' || schedules[i].schedule.wednesday.end == '0:00') {
                                    schedules[i].schedule.wednesday.hide = true;
                                }
                                if (schedules[i].schedule.thursday.start == '0:00' || schedules[i].schedule.thursday.end == '0:00') {
                                    schedules[i].schedule.thursday.hide = true;
                                }
                                if (schedules[i].schedule.friday.start == '0:00' || schedules[i].schedule.friday.end == '0:00') {
                                    schedules[i].schedule.friday.hide = true;
                                }

                                var start_str, start;
                                if ($scope.weekday == 'monday') {
                                    start_str = schedules[i].schedule.monday.start.split(":");
                                    start = moment(new Date(year, month, day, start_str[0], start_str[1])).tz('Africa/Luanda');

                                    if (start.diff($scope.d, 'minutes') <= $scope.early && $scope.d.diff(start, 'minutes') <= $scope.late) {
                                        schedules[i].schedule.monday.show = true;
                                        for (var k = 0; k < sessions.length; k++) {
                                            var session_start = moment(new Date(sessions[k].start)).tz('Africa/Luanda');
                                            if (sessions[k].schedule == schedules[i]._id && session_start.isSame(start)) {
                                                schedules[i].schedule.monday.show = false;
                                            }
                                        }
                                    }
                                }

                                if ($scope.weekday == 'tuesday') {
                                    start_str = schedules[i].schedule.tuesday.start.split(":");
                                    start = moment(new Date(year, month, day, start_str[0], start_str[1])).tz('Africa/Luanda');

                                    if (start.diff($scope.d, 'minutes') <= $scope.early && $scope.d.diff(start, 'minutes') <= $scope.late) {
                                        schedules[i].schedule.tuesday.show = true;
                                        for (var k = 0; k < sessions.length; k++) {
                                            var session_start = moment(new Date(sessions[k].start)).tz('Africa/Luanda');
                                            if (sessions[k].schedule == schedules[i]._id && session_start.isSame(start)) {
                                                schedules[i].schedule.tuesday.show = false;
                                            }
                                        }
                                    }
                                }
                                if ($scope.weekday == 'wednesday') {
                                    start_str = schedules[i].schedule.wednesday.start.split(":");
                                    start = moment(new Date(year, month, day, start_str[0], start_str[1])).tz('Africa/Luanda');

                                    if (start.diff($scope.d, 'minutes') <= $scope.early && $scope.d.diff(start, 'minutes') <= $scope.late) {
                                        schedules[i].schedule.wednesday.show = true;
                                        for (var k = 0; k < sessions.length; k++) {
                                            var session_start = moment(new Date(sessions[k].start)).tz('Africa/Luanda');
                                            if (sessions[k].schedule == schedules[i]._id && session_start.isSame(start)) {
                                                schedules[i].schedule.wednesday.show = false;
                                            }
                                        }
                                    }
                                }
                                if ($scope.weekday == 'thursday') {
                                    start_str = schedules[i].schedule.thursday.start.split(":");
                                    start = moment(new Date(year, month, day, start_str[0], start_str[1])).tz('Africa/Luanda');

                                    if (start.diff($scope.d, 'minutes') <= $scope.early && $scope.d.diff(start, 'minutes') <= $scope.late) {
                                        schedules[i].schedule.thursday.show = true;
                                        for (var k = 0; k < sessions.length; k++) {
                                            var session_start = moment(new Date(sessions[k].start)).tz('Africa/Luanda');
                                            if (sessions[k].schedule == schedules[i]._id && session_start.isSame(start)) {
                                                schedules[i].schedule.thursday.show = false;
                                            }
                                        }
                                    }
                                }
                                if ($scope.weekday == 'friday') {
                                    start_str = schedules[i].schedule.friday.start.split(":");
                                    start = moment(new Date(year, month, day, start_str[0], start_str[1])).tz('Africa/Luanda');

                                    if (start.diff($scope.d, 'minutes') <= $scope.early && $scope.d.diff(start, 'minutes') <= $scope.late) {
                                        schedules[i].schedule.friday.show = true;
                                        for (var k = 0; k < sessions.length; k++) {
                                            var session_start = moment(new Date(sessions[k].start)).tz('Africa/Luanda');
                                            if (sessions[k].schedule == schedules[i]._id && session_start.isSame(start)) {
                                                schedules[i].schedule.friday.show = false;
                                            }
                                        }
                                    }
                                }
                            }

                            for (i = 0; i < schedules.length; i++) {
                                if (schedules[i].show) {
                                    schedules[i].start = schedules[i].start.toDate();
                                    schedules[i].end = schedules[i].end.toDate();
                                    $scope.schedules.push(schedules[i]);
                                }
                            }
                            $scope.schedules = schedules;
                        });
                    });
                });
            });
        });
    }
})();