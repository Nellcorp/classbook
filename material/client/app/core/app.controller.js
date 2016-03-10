(function () {
    'use strict';

    angular.module('app')
    .controller('AppCtrl', [ '$scope', '$rootScope', '$state', '$document', 'appConfig', 'AuthService','$cookies', AppCtrl]) // overall control
    
    function AppCtrl($scope, $rootScope, $state, $document, appConfig, AuthService, $cookies) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;

        $scope.$watch('main', function(newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
            $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
            if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                $scope.main.fixedHeader = true;
                $scope.main.fixedSidebar = true;
            }
            if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                $scope.main.fixedHeader = false;
                $scope.main.fixedSidebar = false;
            }
            }
            if (newVal.fixedSidebar === true) {
            $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
            $scope.main.fixedSidebar = false;
            }
        }, true);
    
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                //console.log(fromState);
                //console.log(toState);
                //console.log(AuthService.isAuthenticated());

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
                }, function(error) {
                    AuthService.clear();
                    $state.transitionTo('page/signin');
                    event.preventDefault(); 
                });
        });

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {

            if (currentRoute.authenticate && !AuthService.isAuthenticated()){
                AuthService.clear();
                $state.transitionTo('page/signin');
                event.preventDefault(); 
            }else{
                $document.scrollTo(0, 0);
            }
        });

        $rootScope.$on('$stateChangeError', function(event) {
            $state.transitionTo('page/404');
            event.preventDefault(); 
        });
    }

})(); 