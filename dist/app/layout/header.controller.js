(function () {
    'use strict';

    angular.module('app.header',['app.service','app.context','ngCookies'])
    .controller('headerCtrl', ['$scope', '$window', '$location', '$cookies', 'AuthService', '$state','$stateParams', '$rootScope', headerCtrl]);
    
    function headerCtrl($scope, $window, $location, $cookies, AuthService, $state, $stateParams, $rootScope) {
            $scope.user = $cookies.getObject('user');

            $scope.logout = function() {
                AuthService.logout.get(function(success) {
                    AuthService.clear();
                    $cookies.remove('auth');
                    $cookies.remove('user');
                    $location.url('/page/signin');

                }, function(error) {
                    $scope.form_error = true;
                    if(error.status == 403 || error.status == 401){
                        AuthService.clear();
                        $location.url('/page/signin');
                    }
                });
            }
    }

})();