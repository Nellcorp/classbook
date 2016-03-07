(function () {
    'use strict';

    angular.module('app.manager', ['ngResource','validation.match','angularRandomString'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .controller('createManagerCtrl', ['$scope','$location','randomString', 'UserService','SchoolService',createManagerCtrl])
        .controller('managerCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','$stateParams',managerCtrl]);


    function createManagerCtrl ($scope, $location, randomString, UserService, SchoolService) {
        
        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});
        
        var orig_user, orig_school;

        $scope.user = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            email: '',
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
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };    
        
        $scope.submitForm = function() {
            
            SchoolService.save($scope.school,function(school){ 
                console.log(school);    
                $scope.user.school = school._id;
                
                UserService.save($scope.user,function(user){ 
                console.log(user);    
                $location.url('/page/manager/profile/'+$scope.user._id);});
                
        });
        };           
    }

    function managerCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
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