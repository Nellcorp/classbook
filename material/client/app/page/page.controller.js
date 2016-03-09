(function () {
    'use strict';

    angular.module('app.page',['app.service','ngCookies'])
    //angular.module('app.page',[])
    .controller('invoiceCtrl', ['$scope', '$window', invoiceCtrl])
    .controller('authCtrl', ['$scope', '$window', '$location', '$cookies', 'UserService', 'AuthService', '$stateParams', authCtrl]);
    //.controller('authCtrl', ['$scope', '$window', '$location', authCtrl]);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;
        
        $scope.printInvoice = function() {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;        
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }


    function authCtrl($scope, $window, $location, $cookies, UserService, AuthService, $stateParams) {
            
            $scope.credentials = { phone: '', password: '' };
            $scope.login_error = false;
            $scope.logout_error = false;
            $scope.exp = new Date();
            $scope.exp.setDate($scope.exp.getDate() + 1);
            $scope.reset_login = angular.copy($scope.credentials);


            //LOGIN
            $scope.initLogin = function () {
                $cookies.remove('auth'); $cookies.remove('user');
                if($cookies.get('auth') === 'true' && typeof $cookies.getObject('user') != 'undefined'){
                    //$location.url('/page/profile/' + $cookies.getObject('user').id);
                }    
            };
            
            $scope.login = function() {
            
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
                    
                    $location.url('/page/profile/'+user._id);

                }, function(error) {
                    $scope.login_error = true;
                });
            }


            $scope.canLogin = function() { return $scope.loginForm.$valid && !angular.equals($scope.credentials, $scope.reset_login);}
            $location.url('/')

            //LOGOUT
            $scope.logout = function() {
                AuthService.logout.get(function(success) {
                    $cookies.remove('auth');
                    $cookies.remove('user');
                    $location.url('/page/signin')

                }, function(error) {
                    console.log(error);
                    $scope.logout_error = true;
                    if(error.status == 403){
                        $cookies.remove('auth');
                        $cookies.remove('user');
                    }
                });
            }

            //SIGNUP
            $scope.signup = function() { $location.url('/')}

            //RESET PASSWORD
            $scope.reset =    function() { $location.url('/') }

            //Unlock APP
            $scope.unlock =    function() { $location.url('/') }     
    }


})(); 



