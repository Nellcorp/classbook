(function () {
    'use strict';

    angular.module('app.professor', ['app.service','validation.match','angularRandomString'])
        .controller('createProfCtrl', ['$scope','$location','randomString', 'UserService','AuthService', 'SchoolService','$stateParams',createProfCtrl])
        .controller('batchProfCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','CourseService','$stateParams',batchProfCtrl])
        .controller('profCtrl', ['$scope','$location','randomString', 'UserService', 'SchoolService','$stateParams',profCtrl]);


    function createProfCtrl ($scope, $location, randomString, UserService, AuthService, SchoolService, $stateParams) {
        $scope.id = $stateParams.id;
        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});

        $scope.user = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            email: '',
            type: 'professor',
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
                $location.url('/page/school/professors/'+$scope.school._id);
                
        });


            
        };           
        
        
    }

    function profCtrl ($scope, $location, randomString, UserService, SchoolService, $stateParams) {
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

    function batchProfCtrl ($scope, $location, randomString, UserService, SchoolService, CourseService, $stateParams) {
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

            var users = $scope.batch.split( "\n" );

            var temp = [];
            
            //firtname,lastname,email,phone
            for( var i = 0; i < users.length; i++ ) {

                temp = users[i].split( "," );
                
                if(temp.length == 4 && email.test(temp[2]) && phone.test(temp[3])){
                            var user = {
                                firstname: temp[0],
                                lastname: temp[1],
                                school: $scope.id,
                                phone: temp[3],
                                email: temp[2],
                                type: 'professor',
                                password: randomString()
                            };
                            UserService.save(user,function(response){console.log(response);});
                }
            }

        $location.url('/page/school/professors/'+$scope.id);
        };           
    }



})(); 