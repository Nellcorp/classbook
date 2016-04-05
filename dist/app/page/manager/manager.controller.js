(function () {
    'use strict';

    angular.module('app.manager', ['app.service','validation.match','angularRandomString'])
        .controller('createManagerCtrl', ['$scope','$location','randomString', 'UserService','SchoolService', 'AuthService', createManagerCtrl])
        .controller('managerCtrl', ['$scope','$location','randomString', 'UserService','SchoolService', 'AuthService', '$stateParams',managerCtrl]);


    function createManagerCtrl ($scope, $location, randomString, UserService, SchoolService, AuthService) {
        
        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});
        
        var orig_user, orig_school;

        $scope.user = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            type: 'manager',
            email: '',
            password: randomString()
        }   

        $scope.school = {
            name: '',
            country: 'Angola',
            city: '',
            address: '',
            manager: '',
            semesters: {
                first: {start: '', end: ''},
                second: {start: '', end: ''}
            }
        }

        orig_user = angular.copy($scope.user);
        orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {
            var validate_second = $scope.school.semesters.second.end > $scope.school.semesters.second.start;
            var validate_first = $scope.school.semesters.first.end > $scope.school.semesters.first.start;
            var validate_semesters = $scope.school.semesters.first.end < $scope.school.semesters.second.start;
            var validate_form = $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
            return validate_first && validate_second && validate_semesters && validate_form;
        };    
        
        $scope.submitForm = function() {
            //console.log($scope.school);    
            SchoolService.save($scope.school,function(school){ 
        
                $scope.user.school = school._id;
        
                AuthService.register.save($scope.user,function(user){ 
                $scope.user = user;
                $location.url('/page/manager/profile/'+$scope.user._id);});
                
        });
        };           
    }

    function managerCtrl ($scope, $location, randomString, UserService, SchoolService, AuthService, $stateParams) {
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

            
            UserService.update({id: $scope.user._id},$scope.user,function(user){ console.log(user);});

        };           
        
        
    }



})(); 