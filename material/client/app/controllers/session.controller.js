(function() {
    'use strict';

    angular.module('app.session')
        .controller('createSessionCtrl', ['$scope', '$q', 'moment', '$cookies', '$location', 'UserService', 'SchoolService', 'CourseService', 'SubjectService', 'ScheduleService', 'SessionService', 'AbsenceService', '$stateParams', createSessionCtrl])
        .controller('sessionCtrl', ['$scope', '$location', 'moment', 'UserService', 'SchoolService', 'CourseService', 'SubjectService', 'ScheduleService', 'SessionService', 'AbsenceService', '$stateParams', sessionCtrl]);


    function createSessionCtrl($scope, $q, moment, $cookies, $location, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AbsenceService, $stateParams) {
        $scope.id = $stateParams.id;

        $scope.weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $scope.d = moment(new Date()).tz('Africa/Luanda');

        var year = $scope.d.year();
        var month = $scope.d.month();
        var day = $scope.d.date();
        var hours = $scope.d.hours();
        var min = $scope.d.minutes();
        var weekday = $scope.d.day();
        $scope.weekday_str = $scope.weekdays[$scope.d.day()];

        $scope.user = $cookies.getObject('user');
        //UserService.get({id: $stateParams.user},function(user){
        //$scope.user = user;

        ScheduleService.get({
            id: $scope.id
        }, function(schedule) {
            $scope.schedule = schedule;
            console.log('schedule', schedule);
            SubjectService.get({
                id: schedule.subject
            }, function(subject) {
                $scope.subject = subject;
                console.log('subject', subject);
                CourseService.get({
                    id: subject.course
                }, function(course) {
                    $scope.course = course;
                    console.log('course', course);
                    UserService.query({
                        course: course._id,
                        type: 'student',
                        year: subject.year,
                        group: schedule.group
                    }, function(students) {
                        $scope.students = students;
                        console.log('students', students);

                        var start_str = $scope.schedule.schedule[$scope.weekday_str].start.split(":");
                        var start = moment(new Date(year, month, day, start_str[0], start_str[1])).tz('Africa/Luanda');
                        var end_str = $scope.schedule.schedule[$scope.weekday_str].end.split(":");
                        var end = moment(new Date(year, month, day, start_str[0], end_str[1])).tz('Africa/Luanda');

                        SessionService.query({
                            start: start.toDate(),
                            end: end.toDate(),
                            schedule: $scope.schedule._id
                        }, function(sessions) {
                            if (sessions.length > 0) {
                                $location.url('/page/profile/' + $scope.user.type);
                            }
                        });


                        $scope.late = 20; //20 minutes
                        $scope.early = 10; //10 minutes
                        //$scope.late = 360000;
                        //$scope.early = 36000;
                        console.log('start = ', start.format());
                        console.log('now = ', $scope.d.format());
                        console.log('start - now = ', start.unix() - $scope.d.unix());
                        console.log('scope early = ', $scope.early * 60);
                        console.log('now - start = ', $scope.d.unix() - start.unix());
                        console.log('scope late x 1000 = ', $scope.late * 60);
                        console.log('is early?', start.unix() - $scope.d.unix() > $scope.early * 60);
                        console.log('is late?', $scope.d.unix() - start.unix() > $scope.late * 60);

                        if (start.unix() - $scope.d.unix() > $scope.early * 60 || $scope.d.unix() - start.unix() > $scope.late * 60) {
                            $location.url('/page/profile/' + $scope.user.type);
                        }



                        $scope.session = {
                            title: $scope.subject.name,
                            school: $scope.user.school,
                            professor: $scope.user.id,
                            schedule: $scope.schedule._id,
                            course: $scope.course._id,
                            subject: $scope.subject._id,
                            summary: '',
                            start: start,
                            end: end,
                            started: $scope.d,
                            missing: []
                        };


                        var orig;

                        orig = angular.copy($scope.session);
                    });
                });
            });
        });
        //});


        $scope.selected = [];
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item._id);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item._id);
        };
        $scope.exists = function(item, list) {
            return list.indexOf(item._id) > -1;
        };


        $scope.init = function() {

        };

        $scope.canSubmit = function() {
            //return $scope.session.summary != '';
            return !!$scope.students && $scope.session.summary != '';
        };

        $scope.submitForm = function() {
            var missing = $scope.students;
            console.log(missing);
            for (var i = 0; i < $scope.selected.length; i++) {
                for (var j = 0; j < missing.length; j++) {
                    if ($scope.selected[i] == missing[j]._id) {
                        missing.splice(j, 1);
                    }
                    console.log(missing);
                };
            };

            delete $scope.students;
            //console.log(missing);

            $scope.session.missing = missing;

            SessionService.save($scope.session, function(response) {
                console.log(response);
                var session_id = response._id;
                var chain = $q.when();
                angular.forEach(missing, function(student, key) {
                    chain = chain.then(function() {
                        var absence = {
                            user: student._id,
                            phone: student.phone,
                            school: student.school,
                            year: student.year,
                            course: $scope.course.name,
                            subject: $scope.subject.name,
                            type: 'student',
                            session: response._id,
                            message: student.firstname + ', faltou à aula de ' + $scope.subject.name + ' em ' + $scope.d.format('LLLL'),
                            supervisor_phone: student.supervisor.phone,
                            supervisor_message: student.firstname + ', faltou à aula de ' + $scope.subject.name + ' em ' + $scope.d.format('LLLL'),
                            time: $scope.d.format()
                        };

                        return AbsenceService.save(absence, function(res) {
                            //console.log(res);
                        });
                    });
                });

                // the final chain object will resolve once all the posts have completed.
                chain.then(function() {
                    console.log('all done!');
                    $location.url('/page/session/profile/' + session_id);
                });
            });



        };


    }

    function sessionCtrl($scope, $location, moment, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AbsenceService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.students = [];

        SessionService.get({
            id: $scope.id
        }, function(session) {
            $scope.session = session;
            $scope.date = moment(new Date(session.started)).tz('Africa/Luanda').format('LLLL');
            console.log(session);
            ScheduleService.get({
                id: session.schedule
            }, function(schedule) {
                $scope.schedule = schedule;
                SubjectService.get({
                    id: schedule.subject
                }, function(subject) {
                    $scope.subject = subject;

                    angular.forEach(session.missing, function(student, key) {
                        UserService.get({
                            id: student
                        }, function(response) {
                            $scope.students.push(response);
                        });
                    });
                });
            });
        });
    }



})();