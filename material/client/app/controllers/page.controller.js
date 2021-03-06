(function() {
    'use strict';

    angular.module('app.page')
        .controller('authCtrl', ['$scope', '$rootScope', '$window', '$location', '$cookies', 'UserService', 'AuthService', 'StorageService', 'moment', '$stateParams', authCtrl]);

    function authCtrl($scope, $rootScope, $window, $location, $cookies, UserService, AuthService, StorageService, moment, $stateParams) {
        //console.log('auth ctrl',$cookies.getObject('user'));

        $scope.credentials = {
            phone: '',
            password: ''
        };

        $scope.form_error = false;
        $scope.exp = moment(new Date()).tz('Africa/Luanda');
        $scope.exp.add(5, 'hours');
        $scope.reset_login = angular.copy($scope.credentials);
        $scope.password = {
            password: '',
            confirm: ''
        };
        $scope.reset_pass = angular.copy($scope.password);
        $scope.reset_phone = '';
        $scope.url_404 = '/page/signin';
        $scope.token = false;
        $scope.user = '';


        $scope.initUser = function() {
            if($rootScope.hasOwnProperty('user') && typeof $rootScope.user !== 'undefined'){
                $scope.user = $rootScope.user;
            }else{
                $scope.user = $cookies.getObject('user');    
            }
            
        };

        //LOGIN
        $scope.initLogin = function() {
            //$cookies.remove('auth'); $cookies.remove('user');
            //console.log('login init',$cookies.getObject('user'));


            AuthService.auth.get(function(user) {
                AuthService.clear();
                $cookies.remove('auth', {
                    domain: 'classbook.co'
                });
                $cookies.remove('user', {
                    domain: 'classbook.co'
                });

                delete $rootScope.user;
                
                $cookies.putObject('user', {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    school: user.school,
                    phone: user.phone,
                    type: user.type
                }, {
                    'expires': $scope.exp.toDate()
                });

                $cookies.put('auth', 'true', {
                    'expires': $scope.exp.toDate()
                });

                $rootScope.user = {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    school: user.school,
                    phone: user.phone,
                    type: user.type
                };

                if (StorageService.isEmpty()) {
                    StorageService.load();
                }

                //$location.url('/page/profile/'+user._id);
                $location.url('/page/profile/' + user.type);

            }, function(error) {
                //console.log('Init Login',error);
                AuthService.clear();
                delete $rootScope.user;
            });

        };

        $scope.login = function() {
            //console.log('login',$cookies.getObject('user'));
            AuthService.clear();
            //console.log('Login Clear',JSON.stringify($cookies.getObject('user')));
            $cookies.remove('auth', {
                domain: 'classbook.co'
            });
            $cookies.remove('user', {
                domain: 'classbook.co'
            });

            delete $rootScope.user;
            //console.log('Login Clear2',JSON.stringify($cookies.getObject('user')));
            AuthService.login.save($scope.credentials, function(user) {

                $cookies.putObject('user', {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    school: user.school,
                    phone: user.phone,
                    type: user.type
                }, {
                    'expires': $scope.exp.toDate()
                });

                //console.log('After Login: User',user);
                //console.log('After Login',JSON.stringify($cookies.getObject('user')));
                $cookies.put('auth', 'true', {
                    'expires': $scope.exp.toDate()
                });

                $rootScope.user = {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    school: user.school,
                    phone: user.phone,
                    type: user.type
                };

                StorageService.load();
                //console.log('After Load',JSON.stringify($cookies.getObject('user')));
                //$location.url('/page/profile/'+user._id);
                $location.url('/page/profile/' + user.type);
                //$location.url('/page/profile');

            }, function(error) {
                $scope.form_error = true;
            });
        };


        $scope.canLogin = function() {
            return !!$scope.loginForm && $scope.loginForm.$valid && !angular.equals($scope.credentials, $scope.reset_login);
        };
        //$location.url('/')

        //LOGOUT
        $scope.logout = function() {
            AuthService.logout.get(function(success) {
                $cookies.remove('auth', {
                    domain: 'classbook.co'
                });
                $cookies.remove('user', {
                    domain: 'classbook.co'
                });

                delete $rootScope.user;
                $location.url('/page/signin');

            }, function(error) {
                console.log(error);
                //$scope.form_error = true;
                if (error.status == 403 || error.status == 401) {
                    AuthService.clear();
                    delete $rootScope.user;
                    $location.url('/page/signin');
                }
            });
        };

        //SIGNUP
        $scope.signup = function() {
            $location.url('/');
        };

        //RESET PASSWORD

        $scope.canReset = function() {
            return !!$scope.resetForm && $scope.resetForm.$valid && $scope.reset_phone !== '' && $scope.reset_phone.length == 9;
        };

        $scope.reset = function() {

            AuthService.reset.save({
                phone: $scope.reset_phone
            }, function(token) {

                $location.url('/page/signin');

            }, function(error) {
                //$location.url('/page/404');
                $scope.form_error = true;
            });
        };


        //RESTORE PASSWORD
        $scope.initRestore = function() {

            //$cookies.remove('auth'); $cookies.remove('user');


            AuthService.token.get({
                id: $stateParams.id
            }, function(token) {
                $scope.token = token;

            }, function(error) {
                //$location.url('/page/profile/'+user._id);
                $scope.form_error = true;
            });

        };

        $scope.initActivate = function() {

            //$cookies.remove('auth'); $cookies.remove('user');
            AuthService.logout.get(function(success) {
                $cookies.remove('auth', {
                    domain: 'classbook.co'
                });
                $cookies.remove('user', {
                    domain: 'classbook.co'
                });

                delete $rootScope.user;
                
            }, function(error) {
                console.log(error);
                //$scope.form_error = true;
                if (error.status == 403 || error.status == 401) {
                    AuthService.clear();
                    delete $rootScope.user;
                }
            });

            AuthService.token.get({
                id: $stateParams.id
            }, function(token) {
                $scope.token = token;

            }, function(error) {
                $scope.form_error = true;
            });

        };


        $scope.restore = function() {

            AuthService.restore.save({
                token: $scope.token._id,
                password: $scope.password.password
            }, function(user) {

                $location.url('/page/signin');

            }, function(error) {
                //$location.url('/page/404');
                $scope.form_error = true;
            });
        };


        $scope.canRestore = function() {
            return !!$scope.restoreForm && $scope.restoreForm.$valid && $scope.password.password !== '' && !!$scope.token;
        };


        //CHANGE PASSWORD
        $scope.change = function() {

            AuthService.password.save({
                password: $scope.password.password
            }, function(user) {

                //$location.url('/page/profile/'+user._id);
                $location.url('/page/profile/' + user.type);

            }, function(error) {
                //$location.url('/page/404');
                $scope.form_error = true;
            });
        };

        $scope.confirmPassword = function() {
            return !!$scope.pwdForm && $scope.pwdForm.$valid && !angular.equals($scope.password, $scope.reset_pass) && $scope.password.password === $scope.password.confirm;
        };

        //Unlock APP
        $scope.unlock = function() {
            $location.url('/');
        };


        $scope.nfound = function() {

            //$cookies.remove('auth'); $cookies.remove('user');


            AuthService.auth.get(function(user) {

                $cookies.putObject('user', {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    school: user.school,
                    phone: user.phone,
                    type: user.type
                }, {
                    'expires': $scope.exp.toDate()
                });

                $cookies.put('auth', 'true', {
                    'expires': $scope.exp.toDate()
                });

                $rootScope.user = {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    school: user.school,
                    phone: user.phone,
                    type: user.type
                };

                //$scope.url_404 = '/page/profile/' + user._id;
                $scope.url_404 = '/page/profile/' + user.type;


            }, function(error) {
                AuthService.clear();
                delete $rootScope.user;
            });

        };
    }


})();