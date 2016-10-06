(function() {
    'use strict';

    angular.module('app.school')
        .controller('schoolCtrl', ['$scope', '$rootScope','$cookies','$location', 'moment', 'randomString', 'UserService', 'SubjectService', 'SchoolService', '$stateParams', schoolCtrl])
        .controller('schoolListCtrl', ['$scope', '$location', 'randomString', 'SchoolService', 'UserService', '$stateParams', schoolListCtrl])
        .controller('schoolProfCtrl', ['$scope', '$location', 'randomString', 'UserService', 'SchoolService', '$stateParams', schoolProfCtrl])
        .controller('schoolCourseCtrl', ['$scope', '$location', 'randomString', 'CourseService', 'SchoolService', '$stateParams', schoolCourseCtrl])
        .controller('schoolSubjectCtrl', ['$scope', '$location', 'SchoolService', 'CourseService', 'SubjectService', '$stateParams', schoolSubjectCtrl])
        .controller('schoolStudentCtrl', ['$scope', '$location', 'randomString', 'UserService', 'SchoolService', '$stateParams', schoolStudentCtrl]);


    function schoolCtrl($scope, $rootScope, $cookies, $location, moment, randomString, UserService, SubjectService, SchoolService, $stateParams) {

        if($rootScope.hasOwnProperty('user') && typeof $rootScope.user !== 'undefined'){
                $scope.currentuser = $rootScope.user;
            }else{
                $scope.currentuser = $cookies.getObject('user');
            }

        $scope.id = $stateParams.id;

        SchoolService.get({
            id: $scope.id
        }, function(school) {
            //console.log(school);
            $scope.school = school;
            $scope.school.semesters.first.start = new Date($scope.school.semesters.first.start);
            $scope.school.semesters.first.end = new Date($scope.school.semesters.first.end);
            $scope.school.semesters.second.start = new Date($scope.school.semesters.second.start);
            $scope.school.semesters.second.end = new Date($scope.school.semesters.second.end);
            //console.log(typeof $scope.school.semesters.first.start);
            //console.log($scope.school.semesters.first.start instanceof Date);
            //console.log($scope.school.semesters.first.start);
            //console.log($scope.school.semesters.first.start.toString());


            UserService.query({
                school: school._id,
                type: 'manager'
            }, function(users) {
                $scope.user = users[0];
                var orig_user = angular.copy($scope.user);
                var orig_school = angular.copy($scope.school);
                var fstart = moment(new Date(school.semesters.first.start)).tz('Africa/Luanda');
                var fend = moment(new Date(school.semesters.first.end)).tz('Africa/Luanda');
                var sstart = moment(new Date(school.semesters.second.start)).tz('Africa/Luanda');
                var send = moment(new Date(school.semesters.second.end)).tz('Africa/Luanda');

                $scope.canSubmit = function() {

                    if($scope.currentuser.type !== 'admin' || $scope.currentuser.type !== 'manager'){ return false; }

                    var validate_second = $scope.school.semesters.second.end > $scope.school.semesters.second.start;
                    var validate_first = $scope.school.semesters.first.end > $scope.school.semesters.first.start;
                    var validate_semesters = $scope.school.semesters.first.end < $scope.school.semesters.second.start;
                    var validate_form = !angular.equals($scope.user, orig_user) || !angular.equals($scope.school, orig_school);
                    return validate_first && validate_second && validate_semesters && validate_form;
                    //return validate_first && validate_second && validate_semesters;
                };

                $scope.submitForm = function() {
                    //$scope.showInfoOnSubmit = true;
                    var school = $scope.school;
                    school.semesters.first.start = moment(new Date(school.semesters.first.start)).tz('Africa/Luanda');
                    school.semesters.first.end = moment(new Date(school.semesters.first.end)).tz('Africa/Luanda');
                    school.semesters.second.start = moment(new Date(school.semesters.second.start)).tz('Africa/Luanda');
                    school.semesters.second.end = moment(new Date(school.semesters.second.end)).tz('Africa/Luanda');

                    SchoolService.update({
                        id: $scope.id
                    }, school, function(response) {
                        //console.log(response);
                    });

                    if( !fstart.isSame($scope.school.semesters.first.start)||
                        !fend.isSame($scope.school.semesters.first.end) ||
                        !sstart.isSame($scope.school.semesters.second.start) ||
                        !send.isSame($scope.school.semesters.second.end) ){
                        
                        SubjectService.query({ school: school._id }, function(subjects) {

                            async.each(subjects, function(subject, callback) {

                                // Perform operation on file here.
                                if(subject.semester.name == 'first'){
                                    subject.semester.start = fstart;
                                    subject.semester.end = fend;
                                }

                                if(subject.semester.name == 'second'){
                                    subject.semester.start = sstart;
                                    subject.semester.end = send;
                                }

                                SubjectService.update({ id: subject._id}, subject, function(result){ callback(); },function(error){
                                    callback('Error updating subject ID: ' + subject._id);
                                });
                            }, function(err) {
                                // if any of the tasks produced an error, err would equal that error
                                if( err ) {
                                    // One of the iterations produced an error.
                                    // All processing will now stop.
                                    console.log('A task failed to process');
                                } else {
                                    console.log('All tasks have been processed successfully');
                                }
                            });
                        });
                    }

                    UserService.update({
                        id: $scope.user._id
                    }, $scope.user, function(response) {
                        //console.log(response); 
                    });


                };
            }, function(error) {
                //no manager
            });
        }, function(error) {
            //no school
        });






    }

    function schoolListCtrl($scope, $location, randomString, SchoolService, UserService, $stateParams) {

        SchoolService.query(function(schools) {
            $scope.schools = schools;
            $scope.managers = {};
            UserService.query({
                type: 'manager'
            }, function(managers) {
                for (var i = 0; i < managers.length; i++) {
                    for (var j = 0; j < $scope.schools.length; j++) {
                        if (managers[i].school == $scope.schools[j]._id) {
                            $scope.schools[j].manager = managers[i];
                        }
                    };
                };
            });
        });
    }

    function schoolProfCtrl($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;

        SchoolService.get({
            id: $scope.id
        }, function(school) {
            $scope.school = school;

            UserService.query({
                school: school._id,
                type: 'professor'
            }, function(users) {
                $scope.users = users;
                //console.log(users);
            });
        });

    }

    function schoolStudentCtrl($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;

        SchoolService.get({
            id: $scope.id
        }, function(school) {
            $scope.school = school;

            UserService.query({
                school: school._id,
                type: 'student'
            }, function(users) {
                $scope.users = users;
            });
        });

    }

    function schoolCourseCtrl($scope, $location, randomString, CourseService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;

        SchoolService.get({
            id: $scope.id
        }, function(school) {
            $scope.school = school;

            CourseService.query({
                school: school._id
            }, function(courses) {
                $scope.courses = courses;
                //console.log(courses);
            });
        });

    }

    function schoolSubjectCtrl($scope, $location, SchoolService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;

        SchoolService.get({
            id: $scope.id
        }, function(school) {
            $scope.school = school;

            SubjectService.query({
                school: school._id
            }, function(subjects) {
                $scope.subjects = subjects;
                //console.log(subjects);


                CourseService.query({
                    school: $scope._id
                }, function(courses) {
                    $scope.courses = courses;

                    for (var i = 0; i < subjects.length; i++) {
                        for (var j = 0; j < courses.length; j++) {
                            if (subjects[i].course == courses[j]._id) {
                                subjects[i].coursename = courses[j].name;
                            }
                        };
                    };
                });
            });
        });

    }

})();