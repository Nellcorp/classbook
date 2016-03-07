(function () {
    'use strict';

    angular.module('app.admin', ['ngResource','validation.match','angularRandomString'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .controller('createAdminCtrl', ['$scope','$location','randomString', 'UserService','SchoolService',createAdminCtrl])
        .controller('adminCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','$stateParams',adminCtrl]);


    function createAdminCtrl ($scope, $location, randomString, UserService, SchoolService) {
        
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
            //$scope.showInfoOnSubmit = true;
            $scope.school.name = $scope.user.school;
            
            UserService.save($scope.user,function(response){ 
                console.log(response);    
                $scope.school.manager = response._id;
                SchoolService.save($scope.school);
                $location.url('/page/manager/profile/'+$scope.school.manager);
                
        });


            
        };           
        
        
    }

    function adminCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        
        UserService.get({id: $scope.id},function(user) {
            $scope.user = user;
            SchoolService.query({name: user.school},function(schools) {
                console.log(schools[0]);
                $scope.school = schools[0];
            }); 
        });
        

        var orig_user = angular.copy($scope.user);
        var orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            $scope.school.name = $scope.user.school;
            var user = $scope.user;
            var school = $scope.school;

            var response = UserService.save(function(user){ 
                
                school.manager = response._id;
                school = SchoolService.save($scope.school);
        });

        };           
        
        
    }



})(); 