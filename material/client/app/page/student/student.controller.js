(function () {
    'use strict';

    angular.module('app.student', ['app.service','validation.match','angularRandomString'])
        .controller('createStudentCtrl', ['$scope','$location','randomString', 'UserService','AuthService','SchoolService','$stateParams',createStudentCtrl])
        .controller('batchStudentCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','CourseService','$stateParams',batchStudentCtrl])
        .controller('courseStudentCtrl', ['$scope','$location','randomString', 'UserService','CourseService','$stateParams',courseStudentCtrl])
        .controller('subjectStudentCtrl', ['$scope','$location','randomString', 'UserService','CourseService','SubjectService','$stateParams',subjectStudentCtrl])
        .controller('scheduleStudentCtrl', ['$scope','$location','randomString', 'UserService','CourseService','SubjectService','ScheduleService','$stateParams',scheduleStudentCtrl])
        .controller('studentCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','$stateParams',studentCtrl]);


    function createStudentCtrl ($scope, $location, randomString, UserService, AuthService, SchoolService,$stateParams) {
        $scope.id = $stateParams.id;
        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});

        $scope.user = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            email: '',
            type: 'student',
            email: '',
            year: '',
            supervisor:{
                firstname: '',
                lastname: '',
                email: '',
                phone: ''
            },
            password: randomString()
        }

        var orig_user = angular.copy($scope.user);

        SchoolService.get({id: $scope.id},function(school) {
                console.log(school);
                $scope.school = school;
                $scope.user.school = school._id;
            });    

        
        

        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;
            AuthService.register.save($scope.user,function(response){ 
                console.log(response);    
                $location.url('/page/school/students/'+$scope.school._id);
                
        });


            
        };           
        
        
    }

    function batchStudentCtrl ($scope, $location, randomString, UserService, SchoolService, CourseService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.query({school: $scope.id},function(courses){$scope.courses = courses;});

        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});
        $scope.batch = '';

        SchoolService.get({id: $scope.id},function(school) {
                console.log(school);
                $scope.school = school;
            });    

        
        

        $scope.canSubmit = function() {return $scope.userForm.$valid && $scope.batch != '';};    
        
        $scope.submitForm = function() {
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;  

            var students = $scope.batch.split( "\n" );

            var temp = [];
            
            //firtname,lastname,email,phone,fname,lname,email,phone,course,year
            for( var i = 0; i < students.length; i++ ) {

                temp = students[i].split( "," );
                
                if(temp.length == 10 && email.test(temp[2]) && email.test(temp[6]) && phone.test(temp[3]) && phone.test(temp[7]) && temp[9] > 0 && temp[9] < 6){

                    for( var j = 0; j < $scope.courses.length; j++ ) {
                        if($scope.courses[j].name == temp[8].toLowerCase()){
                            var student = {
                                firstname: temp[0], lastname: temp[1], school: $scope.id, course: $scope.courses[j], phone: temp[3], email: temp[2], type: 'student',
                                year: temp[9], supervisor:{firstname: temp[4], lastname: temp[5],email: temp[6],phone: temp[7]},password: randomString()
                            };
                            UserService.save(student,function(response){console.log(response);});
                        }
                    }
                }
            }

        $location.url('/page/school/students/'+$scope.id);
        };           
    }

    function studentCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        
        UserService.get({id: $scope.id},function(user) {
            $scope.user = user;
            SchoolService.get({id: user.school},function(school) {
                console.log(school);
                $scope.school = school;
            }); 
        });
        

        var orig_user = angular.copy($scope.user);
        var orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            UserService.update({id: $scope.user._id},$scope.user,function(user){ 
                console.log(user);
            });

        };           
        
        
    }

function courseStudentCtrl ($scope, $location, randomString, UserService, CourseService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                
                UserService.query({course: course._id, type: 'student'},function(users) {
                    $scope.users = users;
                });
            });
        
    }

    function subjectStudentCtrl ($scope, $location, randomString, UserService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SubjectService.get({id: $scope.id},function(subject) {
                $scope.subject = subject;
                
                CourseService.get({id: $scope.subject.course},function(course) {$scope.course = course;});
                UserService.query({course: $scope.subject.course, type: 'student'},function(users) {$scope.users = users; console.log(users)});

            });
        
    }

    function scheduleStudentCtrl ($scope, $location, randomString, UserService, CourseService, SubjectService, ScheduleService, $stateParams) {
        $scope.id = $stateParams.id;
        
        ScheduleService.get({id: $scope.id},function(schedule) {
                $scope.schedule = schedule;
                
                SubjectService.get({id: schedule.subject},function(subject) {
                $scope.subject = subject;
                
                CourseService.get({id: $scope.subject.course},function(course) {$scope.course = course;});
                UserService.query({course: $scope.subject.course, type: 'student'},function(users) {$scope.users = users; console.log(users)});

            });

            });
        
    }

})(); 