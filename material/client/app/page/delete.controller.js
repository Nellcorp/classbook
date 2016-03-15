(function () {
    'use strict';

    angular.module('app.delete', ['app.service','validation.match','angularRandomString','ngCookies'])
        .controller('removeUserCtrl', ['$scope','$location','$cookies','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',removeUserCtrl])
        .controller('removeSchoolCtrl', ['$scope','$location','$cookies','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',removeSchoolCtrl])
        .controller('removeCourseCtrl', ['$scope','$location','$cookies','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',removeCourseCtrl])
        .controller('removeSubjectCtrl', ['$scope','$location','$cookies','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',removeSubjectCtrl])
        .controller('removeScheduleCtrl', ['$scope','$location','$cookies','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',removeScheduleCtrl])
        .controller('removeSessionCtrl', ['$scope','$location','$cookies','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',removeSessionCtrl]);


    
    function removeUserCtrl ($scope, $location, $cookies, randomString, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        //Make sure I don't delete an admin
        //Make sure I don't delete a professor with a 

        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        UserService.get({id: $scope.id},function(user) { $scope.user = user; },function(error) { $location.url('/page/profile/'+$cookies.getObject('user').id); });

        $scope.canDelete = function() {
            return !!$scope.user && $scope.user.type != 'admin' && $scope.user.type != 'manager' && !!$scope.userForm && $scope.userForm.$valid;
        };                   

        $scope.delete = function() {
            UserService.delete({id: $scope.user._id},function(user){ 
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
            });

        };           
        
        
    }

    function removeSchoolCtrl ($scope, $location, $cookies, randomString, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        SchoolService.get({id: $scope.id},function(obj) { $scope.obj = user; },function(error) { $location.url('/page/profile/'+$cookies.getObject('user').id); });

        $scope.canDelete = function() { return !!$scope.obj && !!$scope.userForm && $scope.userForm.$valid; };                   

        $scope.delete = function() {
            SchoolService.delete({id: $scope.obj._id},function(obj){ 
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
            });

        };                   
    }

    function removeCourseCtrl ($scope, $location, $cookies, randomString, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        CourseService.get({id: $scope.id},function(obj) { $scope.obj = user; },function(error) { $location.url('/page/profile/'+$cookies.getObject('user').id); });

        $scope.canDelete = function() { return !!$scope.obj && !!$scope.userForm && $scope.userForm.$valid; };                   

        $scope.delete = function() {
            CourseService.delete({id: $scope.obj._id},function(obj){ 
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
            });

        };                   
    }

    function removeSubjectCtrl ($scope, $location, $cookies, randomString, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        SubjectService.get({id: $scope.id},function(obj) { $scope.obj = user; },function(error) { $location.url('/page/profile/'+$cookies.getObject('user').id); });

        $scope.canDelete = function() { return !!$scope.obj && !!$scope.userForm && $scope.userForm.$valid; };                   

        $scope.delete = function() {
            SubjectService.delete({id: $scope.obj._id},function(obj){ 
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
            });

        };                   
    }

    function removeScheduleCtrl ($scope, $location, $cookies, randomString, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        ScheduleService.get({id: $scope.id},function(obj) { $scope.obj = user; },function(error) { $location.url('/page/profile/'+$cookies.getObject('user').id); });

        $scope.canDelete = function() { return !!$scope.obj && !!$scope.userForm && $scope.userForm.$valid; };                   

        $scope.delete = function() {
            ScheduleService.delete({id: $scope.obj._id},function(obj){ 
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
            });

        };                   
    }

    function removeSessionCtrl ($scope, $location, $cookies, randomString, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        SessionService.get({id: $scope.id},function(obj) { $scope.obj = user; },function(error) { $location.url('/page/profile/'+$cookies.getObject('user').id); });

        $scope.canDelete = function() { return !!$scope.obj && !!$scope.userForm && $scope.userForm.$valid; };                   

        $scope.delete = function() {
            SessionService.delete({id: $scope.obj._id},function(obj){ 
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
            });

        };                   
    }



})(); 