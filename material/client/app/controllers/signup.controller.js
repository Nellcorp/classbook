(function() {
    'use strict';

    angular.module('app.signup')
        .controller('createSignupCtrl', ['$scope','$rootScope', 'appConfig', '$location', 'moment', 'SignupService', createSignupCtrl])
        .controller('signupError', ['$scope','$rootScope','appConfig','$location', signupError])
        .controller('signupListCtrl', ['$scope','$rootScope','$cookies','$location','SignupService', 'SchoolService','AuthService','StorageService','randomString','$stateParams',signupListCtrl])
        .controller('signupCtrl', ['$scope','$location','randomString', 'UserService','AuthService','$stateParams',signupCtrl]);


    function signupListCtrl ($scope, $rootScope, $cookies, $location, SignupService, SchoolService, AuthService, StorageService, randomString, $stateParams) {
            if($rootScope.hasOwnProperty('user') && typeof $rootScope.user !== 'undefined'){
                $scope.user = $rootScope.user;
            }else{
                $scope.user = $cookies.getObject('user');    
            }

            if(!$scope.user){$location.url('/page/signin');}
            if( $scope.user.type != 'admin' ){ $location.url('/page/profile/' + $scope.user.type); }

            SignupService.query({},function(schools) {
                $scope.schools = schools;
            });

            $scope.delete = function(school) { 
                SignupService.delete({id: school._id},function(response){
                    $scope.schools = response.signups;
                },function(error){ console.log(error); });
            };

            $scope.approve = function(signup) {
              var  user = {
                    firstname: signup.firstname,
                    lastname: signup.lastname,
                    school: '',
                    phone: signup.phone,
                    type: 'manager',
                    email: signup.email,
                    password: randomString()
            };

            var school = {
                name: signup.school,
                country: signup.country,
                phone: signup.school_phone,
                city: signup.city,
                address: signup.address,
                semesters: signup.semesters
            };

        SchoolService.save(school, function(newschool) {
            console.log('Added school: ', newschool);
                user.school = newschool._id;
                AuthService.register.save(user, function(manager) {
                    console.log('Added manager: ', manager);
                    SignupService.delete({id: signup._id},function(response){
                        console.log('Removed Signup: ', response);
                        $scope.schools = response.signups;
                        //$scope.user = user;
                        StorageService.load();
                        //$location.url('/page/school/profile/' + newschool._id);
                    },function(error){ console.log(error); });
                },function(error){ console.log(error); });
            },function(error){ console.log(error); });
            };
    }

    function signupCtrl ($scope, $location, randomString, UserService, AuthService, $stateParams) {
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

    function signupError($scope, $rootScope, appConfig, $location) {
        if(!$rootScope.hasOwnProperty('error') || !$rootScope.error.status || $rootScope.error.type !== 'signup'){
            $location.url('/page/onboard/new');
        }

        $scope.brand = appConfig.main.brand;
        $scope.error = $rootScope.error.error.data;

    }

    function createSignupCtrl($scope, $rootScope, appConfig, $location, moment, SignupService) {

        $scope.school = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            school_phone: '',
            email: '',
            country: 'Angola',
            city: '',
            address: '',
            semesters: {
                first: {
                    start: moment().tz('Africa/Luanda').toDate(),
                    end: moment().tz('Africa/Luanda').add(6, 'months').toDate()
                },
                second: {
                    start: moment().tz('Africa/Luanda').add(7, 'months').toDate(),
                    end: moment().tz('Africa/Luanda').add(13, 'months').toDate()
                }
            }
        };

        if($rootScope.hasOwnProperty('error') && $rootScope.error.status === true && $rootScope.error.type === 'signup' && typeof $rootScope.error.data !== 'undefined'){
            $scope.school = $rootScope.error.data;
            $scope.school.semesters.first.start = new Date($scope.school.semesters.first.start);
            $scope.school.semesters.first.end = new Date($scope.school.semesters.first.end);
            $scope.school.semesters.second.start = new Date($scope.school.semesters.second.start);
            $scope.school.semesters.second.end = new Date($scope.school.semesters.second.end);
        }

        var orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {
            
            //console.log($scope.school);

            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;
            var validate_phone = false;

            if (!$scope.school.phone || !phone.test($scope.school.phone)) {
                return false;
            }

            if (!$scope.school.firstname || !$scope.school.lastname || !$scope.school.email || !$scope.school.school || !$scope.school.address || !$scope.school.city) {
                return false;
            }

            if (!$scope.school.semesters.first.start || !$scope.school.semesters.first.end || !$scope.school.semesters.second.start || !$scope.school.semesters.second.end) {
                return false;
            }

            if ($scope.school.semesters.second.end <= $scope.school.semesters.second.start) {
                return false;
            }
            if ($scope.school.semesters.first.end <= $scope.school.semesters.first.start) {
                return false;
            }
            if ($scope.school.semesters.first.end >= $scope.school.semesters.second.start) {
                return false;
            }
            //console.log(moment($scope.school.semesters.first.end).tz('Africa/Luanda').format());
            return $scope.userForm.$valid && !angular.equals($scope.school, orig_school);
        };

        $scope.submitForm = function() {
            
            $scope.school.semesters.first.start = moment($scope.school.semesters.first.start).tz('Africa/Luanda').format();
            $scope.school.semesters.first.end = moment($scope.school.semesters.first.end).tz('Africa/Luanda').format();
            $scope.school.semesters.second.start = moment($scope.school.semesters.second.start).tz('Africa/Luanda').format();
            $scope.school.semesters.second.end = moment($scope.school.semesters.second.end).tz('Africa/Luanda').format();

            SignupService.save($scope.school, function(signup) {
                $scope.id = signup._id;
                if($rootScope.hasOwnProperty('error')){delete $rootScope.error;}
                $location.url('/page/onboard/success');
            },function(error) {
                $rootScope.error = {
                    status: true,
                    type: 'signup',
                    data: $scope.school,
                    error: error
                };

                $location.url('/page/onboard/error');
            });
        };
    }
})();