(function () {
    'use strict';

    angular.module('app.admin', ['app.service','ngCookies','validation.match','angularRandomString'])
        .controller('createAdminCtrl', ['$scope','$location','randomString', 'UserService','AuthService',createAdminCtrl])
        .controller('adminListCtrl', ['$scope','$location','randomString', 'UserService','$stateParams',adminListCtrl])
        .controller('adminCtrl', ['$scope','$location','randomString', 'UserService','AuthService','$stateParams',adminCtrl]);


    function createAdminCtrl ($scope, $location, randomString, UserService, AuthService) {
        
        var orig_user, orig_school;

        $scope.user = {
            firstname: '',
            lastname: '',
            phone: '',
            type: 'admin',
            school: 'none',
            email: '',
            password: randomString()
        }   

        orig_user = angular.copy($scope.user);
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user);
        };    
        
        $scope.submitForm = function() {
            
            AuthService.register.save($scope.user,function(user){ $location.url('/page/profile/'+user._id); });
        };           
    }

    function adminListCtrl ($scope, $location, randomString, UserService, $stateParams) {
        UserService.query({type: 'admin'},function(users) { $scope.users = users; });
    }

    function adminCtrl ($scope, $location, randomString, UserService, AuthService, $stateParams) {
        $scope.id = $stateParams.id;
        
        UserService.get({id: $scope.id},function(user) { $scope.user = user; });
        

        var orig_user = angular.copy($scope.user);
        
        $scope.canSubmit = function() { 
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            UserService.update({id: $scope.user._id},$scope.user,function(user){
                //console.log(user);
            });

        };           
        
        
    }



})(); 