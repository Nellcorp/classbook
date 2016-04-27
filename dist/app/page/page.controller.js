(function () {
    'use strict';

    angular.module('app.page',['app.service','ngCookies'])
    .controller('authCtrl', ['$scope', '$window', '$location', '$cookies', 'UserService', 'AuthService', 'StorageService','$stateParams', authCtrl]);

    function authCtrl($scope, $window, $location, $cookies, UserService, AuthService, StorageService, $stateParams) {
            //console.log('auth ctrl',$cookies.getObject('user'));

            $scope.credentials = { phone: '', password: '' };
            $scope.form_error = false;
            $scope.exp = new Date();
            $scope.exp.setDate($scope.exp.getDate() + 1);
            $scope.reset_login = angular.copy($scope.credentials);
            $scope.password = { password: '', confirm: '' };
            $scope.reset_pass = angular.copy($scope.password);
            $scope.reset_phone = '';
            $scope.url_404 = '/page/signin';
            $scope.token = false;
            $scope.user = '';
            
            
            $scope.initUser = function () {
                $scope.user = $cookies.getObject('user');
            };

            //LOGIN
            $scope.initLogin = function () {
                //$cookies.remove('auth'); $cookies.remove('user');
                //console.log('login init',$cookies.getObject('user'));


                AuthService.auth.get(function(user) {
                    AuthService.clear();
                    $cookies.remove('auth');
                    $cookies.remove('user');

                    $cookies.putObject('user',{
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        school: user.school,
                        phone: user.phone,
                        type: user.type
                    }, {'expires': $scope.exp});

                    $cookies.put('auth','true', {'expires': $scope.exp});
                    
                    if(StorageService.isEmpty()){ StorageService.load();}

                    //$location.url('/page/profile/'+user._id);
                    $location.url('/page/profile/'+user.type);

                }, function(error) {
                    AuthService.clear();
                });
                
            };
            
            $scope.login = function() {
            //console.log('login',$cookies.getObject('user'));
                    AuthService.clear();
                    $cookies.remove('auth');
                    $cookies.remove('user');
                AuthService.login.save($scope.credentials,function(user) {

                    $cookies.putObject('user',{
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        school: user.school,
                        phone: user.phone,
                        type: user.type
                    }, {'expires': $scope.exp});

                    $cookies.put('auth','true', {'expires': $scope.exp});
                    StorageService.load();
                    
                    //$location.url('/page/profile/'+user._id);
                    $location.url('/page/profile/'+user.type);
                    //$location.url('/page/profile');

                }, function(error) {
                    $scope.form_error = true;
                });
            }


            $scope.canLogin = function() { return !!$scope.loginForm && $scope.loginForm.$valid && !angular.equals($scope.credentials, $scope.reset_login);}
            //$location.url('/')

            //LOGOUT
            $scope.logout = function() {
                AuthService.logout.get(function(success) {
                    $cookies.remove('auth');
                    $cookies.remove('user');
                    $location.url('/page/signin');

                }, function(error) {
                    console.log(error);
                    $scope.form_error = true;
                    if(error.status == 403 || error.status == 401){
                        AuthService.clear();
                        $location.url('/page/signin');
                    }
                });
            }

            //SIGNUP
            $scope.signup = function() { $location.url('/')}

            //RESET PASSWORD

            $scope.canReset = function() { return !!$scope.resetForm && $scope.resetForm.$valid && $scope.reset_phone != '' && $scope.reset_phone.length == 9;}

            $scope.reset = function() {
            
                AuthService.reset.save({phone: $scope.reset_phone},function(token) {
                    
                    $location.url('/page/signin');

                }, function(error) {
                    //$location.url('/page/404');
                    $scope.form_error = true;
                });
            }


            //RESTORE PASSWORD
            $scope.initRestore = function () {

                //$cookies.remove('auth'); $cookies.remove('user');


                AuthService.token.get({id: $stateParams.id},function(token) {
                    $scope.token = token;

                }, function(error) {
                    //$location.url('/page/profile/'+user._id);
                    $scope.form_error = true;
                });

            };


            $scope.restore = function() {
            
                AuthService.restore.save({token: $scope.token._id, password: $scope.password.password},function(user) {
                    
                    $location.url('/page/signin');

                }, function(error) {
                    //$location.url('/page/404');
                    $scope.form_error = true;
                });
            }


            $scope.canRestore = function() { return !!$scope.restoreForm && $scope.restoreForm.$valid && $scope.password.password != '' && !!$scope.token;}

            
            //CHANGE PASSWORD
            $scope.change = function() {
            
                AuthService.password.save({password: $scope.password.password},function(user) {
                    
                    //$location.url('/page/profile/'+user._id);
                    $location.url('/page/profile/'+user.type);

                }, function(error) {
                    //$location.url('/page/404');
                    $scope.form_error = true;
                });
            }

            $scope.confirmPassword =    function() {
                return !!$scope.pwdForm && $scope.pwdForm.$valid && !angular.equals($scope.password, $scope.reset_pass) && $scope.password.password === $scope.password.confirm;
            }

            //Unlock APP
            $scope.unlock =    function() { $location.url('/') }


            $scope.nfound = function () {

                //$cookies.remove('auth'); $cookies.remove('user');


                AuthService.auth.get(function(user) {
                    
                    $cookies.putObject('user',{
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        school: user.school,
                        phone: user.phone,
                        type: user.type
                    }, {'expires': $scope.exp});

                    $cookies.put('auth','true', {'expires': $scope.exp});
                    
                    //$scope.url_404 = '/page/profile/' + user._id;
                    $scope.url_404 = '/page/profile/'+user.type;
                    

                }, function(error) {
                    AuthService.clear();
                });

            };     
    }


})(); 



