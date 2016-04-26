(function () {
    'use strict';

    angular.module('app')
    .controller('AppCtrl', [ '$scope', '$rootScope', '$state', '$document', 'appConfig', 'AuthService','StorageService','$cookies', AppCtrl]) // overall control
    
    function AppCtrl($scope, $rootScope, $state, $document, appConfig, AuthService, StorageService, $cookies) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        appConfig.main.user = $cookies.getObject('user');
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
            //console.log('stateChangeStart',$cookies.getObject('user'));
                //console.log(fromState);
                //console.log(toState);
                //console.log(AuthService.isAuthenticated());
                var school = /^\/page\/school(\/([A-Za-z]*)){0,1}\/:id$/.test(toState.url);
                var profile = /\/page\/profile\/:id$/.test(toState.url);

                //console.log(profile);
                //console.log($cookies.getObject('user').id);

                
                if(toState.authenticate){

                if(school && $cookies.getObject('user').type != 'admin' && toParams.id != $cookies.getObject('user').school){
                    //$state.go('page/profile', { id: $cookies.getObject('user').id });
                    var params = toParams;
                    params.id = $cookies.getObject('user').school;
                    $state.transitionTo(toState.name, params, {resume: true});
                    //event.preventDefault();
                }

                if(profile && $cookies.getObject('user').type != 'admin' && toParams.id != $cookies.getObject('user').id){
                    var params = toParams;
                    params.id = $cookies.getObject('user').id;
                    $state.transitionTo(toState.name, params, {resume: true});
                    //$state.go('page/profile', { id: $cookies.getObject('user').id });  
                    //event.preventDefault();
                }


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
                    if(StorageService.isEmpty()){ StorageService.load();}
                }, function(error) {
                    AuthService.clear();
                    
                    $state.transitionTo('page/signin');
                    event.preventDefault(); 
                });
            }
        });

    
        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $cookies.putObject('state',currentRoute);
            if (currentRoute.authenticate && !AuthService.isAuthenticated()){
            
                AuthService.clear();
                $state.transitionTo('page/signin');
                event.preventDefault(); 
            }else{
                //console.log('stateChangeSuccess');
                $document.scrollTo(0, 0);
            }
        });

        $rootScope.$on('$viewContentLoaded', function(){
             //console.log($cookies.getObject('user'));
             //console.log('viewContentLoaded');
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
            $state.get('error').error = { code: 123, description: 'Exception stack trace' }
            //console.log('$stateChangeError - fired when an error occurs during transition.');
            //console.log(arguments);
            $state.transitionTo('page/404');
            event.preventDefault(); 
        });
    }

})(); 