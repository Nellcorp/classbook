(function () {
    'use strict';

    angular.module('app.professor')
        .controller('createProfCtrl', ['$scope','$location','randomString', 'UserService','AuthService', 'SchoolService','$stateParams',createProfCtrl])
        .controller('batchProfCtrl', ['$scope','$q','$location','randomString', 'UserService','AuthService','SchoolService','CourseService','StorageService','$stateParams',batchProfCtrl])
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

    function batchProfCtrl ($scope, $q, $location, randomString, UserService, AuthService, SchoolService, CourseService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.ready = [];
        StorageService.load();
        CourseService.query({school: $scope.id},function(courses){$scope.courses = courses;});
        

        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});
        $scope.batch = '';

        SchoolService.get({id: $scope.id},function(school) {
                console.log(school);
                $scope.school = school;
            });    

        
        

        $scope.canSubmit = function() {
            var valid = true;
            $scope.ready = [];
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;
            var school = /^[0-9a-fA-F]{24}$/;
            var users = StorageService.users();
            
            if($scope.batch == '' || !$scope.userForm.$valid || !school.test($scope.id)){return false;}
            var lines = $scope.batch.split( "\n" );
            
            for( var i = 0; i < lines.length; i++ ) {
                var temp = lines[i].split( "," );
                if(temp.length != 4 || !email.test(temp[2]) || !phone.test(temp[3])){ return false;}
                for( var j = 0; j < users.length; j++ ) { if(temp[2] == users[j].email || temp[3] == users[j].phone){return false;} }
                $scope.ready.push({
                    firstname: temp[0],
                    lastname: temp[1],
                    school: $scope.id,
                    phone: temp[3],
                    email: temp[2],
                    type: 'professor',
                    password: randomString()
                });
            }
            return valid;    
        };    
        
        $scope.submitForm = function() {
            var chain = $q.when();
            chain = chain.then(function(){
                for( var i = 0; i < $scope.ready.length; i++ ) { AuthService.register.save($scope.ready[i],function(response){console.log(response);}); }
            });
            chain.then(function(){
                $location.url('/page/school/professors/'+$scope.id);
            });
        };           
    }



})(); 