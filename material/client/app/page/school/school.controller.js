(function () {
    'use strict';

    angular.module('app.school', ['app.service','validation.match','angularRandomString'])
        .controller('schoolCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','$stateParams',schoolCtrl])
        .controller('schoolListCtrl', ['$scope','$location','randomString','SchoolService','$stateParams',schoolListCtrl])
        .controller('schoolProfCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','$stateParams',schoolProfCtrl])
        .controller('schoolCourseCtrl', ['$scope','$location','randomString', 'CourseService','SchoolService','$stateParams',schoolCourseCtrl])
        .controller('schoolSubjectCtrl', ['$scope','$location','SchoolService','CourseService','SubjectService','$stateParams',schoolSubjectCtrl])
        .controller('schoolStudentCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','$stateParams',schoolStudentCtrl]);


    function schoolCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SchoolService.get({id: $scope.id},function(school) {
                console.log(school);
                $scope.school = school;
                $scope.school.semesters.first.start = new Date($scope.school.semesters.first.start);
                $scope.school.semesters.first.end = new Date($scope.school.semesters.first.end);
                $scope.school.semesters.second.start = new Date($scope.school.semesters.second.start);
                $scope.school.semesters.second.end = new Date($scope.school.semesters.second.end);

                UserService.query({school: school._id,type: 'manager'},function(users) {
                    $scope.user = users[0];
                });
            }); 
        
        

        var orig_user = angular.copy($scope.user);
        var orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            SchoolService.update({id: $scope.id},$scope.school,function(response){
                console.log(response);
            });
            
            UserService.update({id:$scope.user._id},$scope.user,function(response){
               console.log(response); 
            });
           

        };           
        
        
    }

    function schoolListCtrl ($scope, $location, randomString, SchoolService, $stateParams) {
        
        SchoolService.query(function(schools) {
                $scope.schools = schools;
                console.log($scope.schools);
            }); 
    }

    function schoolProfCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SchoolService.get({id: $scope.id},function(school) {
                $scope.school = school;
                
                UserService.query({school: school._id, type: 'professor'},function(users) {
                    $scope.users = users;
                    console.log(users);
                });
            });
        
    }

    function schoolStudentCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SchoolService.get({id: $scope.id},function(school) {
                $scope.school = school;
                
                UserService.query({school: school._id, type: 'student'},function(users) {
                    $scope.users = users;
                });
            });
        
    }

    function schoolCourseCtrl ($scope, $location, randomString, CourseService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SchoolService.get({id: $scope.id},function(school) {
                $scope.school = school;
                
                CourseService.query({school: school._id},function(courses) {
                    $scope.courses = courses;
                    console.log(courses);
                });
            });
        
    }

    function schoolSubjectCtrl ($scope, $location, SchoolService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SchoolService.get({id: $scope.id},function(school) {
                $scope.school = school;
                
                SubjectService.query({school: school._id},function(subjects) {
                    $scope.subjects = subjects;
                    console.log(subjects);

                   
                    CourseService.query({school: $scope._id},function(courses) {
                        $scope.courses = courses;
                        
                        for (var i = 0; i < subjects.length; i++) {
                            for (var j = 0; j < courses.length; j++) {
                                if(subjects[i].course == courses[j]._id){
                                    subjects[i].coursename = courses[j].name;
                                }
                            };    
                        };
                    });
                });
            });
        
    }

})(); 