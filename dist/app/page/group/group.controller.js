(function () {
    'use strict';

    angular.module('app.group', ['app.service','validation.match','angularRandomString'])
        .controller('groupCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','CourseService','CourseNameService','$stateParams',groupCtrl])
        .controller('groupStudentCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','CourseService','CourseNameService','$stateParams',groupStudentCtrl]);


    

    function groupCtrl ($scope, $location, randomString, UserService, SchoolService, CourseService, CourseNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
            $scope.course = course;
            SchoolService.get({id: $scope.course.school},function(school) {$scope.school = school;});
        });
        

        var orig_course = angular.copy($scope.course);
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.course, orig_course);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            CourseService.update({id:$scope.id},$scope.course,function(course){
                CourseNameService.save({name: $scope.course.name},function(response){console.log(response);});
            });
        };           
    }

    function groupStudentCtrl ($scope, $location, randomString, UserService, SchoolService, CourseService, CourseNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                
                SubjectService.query({course: course._id, school: course.school},function(subjects) {
                    $scope.subjects = subjects;
                    console.log(subjects);
                });
            });
        
    }

})(); 