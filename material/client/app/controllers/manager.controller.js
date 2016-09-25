(function() {
    'use strict';

    angular.module('app.manager')
        .controller('createManagerCtrl', ['$scope', '$location', 'moment', 'randomString', 'UserService', 'SchoolService', 'AuthService', 'StorageService', createManagerCtrl])
        .controller('managerCtrl', ['$scope', '$location', 'randomString', 'UserService', 'SchoolService', 'AuthService', '$stateParams', managerCtrl]);


    function createManagerCtrl($scope, $location, moment, randomString, UserService, SchoolService, AuthService, StorageService) {

        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});
        $scope.phones = [];
        UserService.query({}, function(users) {
            //console.log(users);
            for (var i = 0; i < users.length; i++) {
                $scope.phones.push(users[i].phone);
            }
        });

        var orig_user, orig_school;

        $scope.user = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            type: 'manager',
            email: '',
            password: randomString()
        };

        $scope.school = {
            name: '',
            country: 'Angola',
            city: '',
            address: '',
            manager: '',
            semesters: {
                first: {
                    start: '',
                    end: ''
                },
                second: {
                    start: '',
                    end: ''
                }
            }
        };

        orig_user = angular.copy($scope.user);
        orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {

            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;
            var users = StorageService.users();
            var schools = StorageService.schools();
            var validate_phone = false;

            if (!$scope.user.phone || !phone.test($scope.user.phone) || !phone.test($scope.school.phone) || $scope.phones.indexOf($scope.user.phone) > -1) {
                return false;
            }
            if (!$scope.user.firstname || !$scope.user.lastname || !$scope.user.email || !$scope.school.name || !$scope.school.address || !$scope.school.city) {
                return false;
            }
            for (var i = 0; i < schools.length; i++) {
                if ($scope.school.phone == schools[i].phone || $scope.school.name == schools[i].name) {
                    return false;
                }
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
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };

        $scope.submitForm = function() {
            //console.log($scope.school);
            $scope.school.semesters.first.start = moment($scope.school.semesters.first.start).tz('Africa/Luanda').format();
            $scope.school.semesters.first.end = moment($scope.school.semesters.first.end).tz('Africa/Luanda').format();
            $scope.school.semesters.second.start = moment($scope.school.semesters.second.start).tz('Africa/Luanda').format();
            $scope.school.semesters.second.end = moment($scope.school.semesters.second.end).tz('Africa/Luanda').format();

            SchoolService.save($scope.school, function(school) {

                $scope.user.school = school._id;

                AuthService.register.save($scope.user, function(user) {
                    $scope.user = user;
                    StorageService.load();
                    $location.url('/page/manager/profile/' + $scope.user._id);
                });

            });
        };
    }

    function managerCtrl($scope, $location, randomString, UserService, SchoolService, AuthService, $stateParams) {
        $scope.id = $stateParams.id;

        UserService.get({
            id: $scope.id
        }, function(user) {
            $scope.user = user;
            SchoolService.get({
                id: user.school
            }, function(school) {
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


            UserService.update({
                id: $scope.user._id
            }, $scope.user, function(user) {
                console.log(user);
            });

        };
    }
})();