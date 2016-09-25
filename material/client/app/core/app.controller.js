(function () {
    'use strict';

    angular.module('app')
    .filter('ucfirst', function() {
        return function (input) {
        var smallWords = /^(a|e|de|do|da|para|como?\.?|via)$/i;
        if (input!=null){
        input = input.toLowerCase();
        return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }

            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }

            return match.charAt(0).toUpperCase() + match.substr(1);
        });
        }
    }
    })
   .filter('upper', function() { return function(input, scope) { if (input!=null) return input.toUpperCase(); } })
   .filter('lower', function() { return function(input, scope) { if (input!=null) return input.toLowerCase(); } })
   .filter('sentence', function() {
        return function(input, scope) {
            if (input!=null)
            input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    })
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
            StorageService.load();
            //console.log('stateChangeStart',$cookies.getObject('user'));
                //console.log('from',fromState);
                //console.log('to',toState);
                //console.log(AuthService.isAuthenticated());
                var school = /^\/page\/school(\/([A-Za-z]*)){0,1}\/:id$/.test(toState.url);
                var profile = /\/page\/profile\/:id$/.test(toState.url);
                var user = ($rootScope.hasOwnProperty('user') && typeof $rootScope.user !== 'undefined')? $rootScope.user : $cookies.getObject('user');
                //console.log(profile);
                //console.log($cookies.getObject('user').id);

                var params;
                if(toState.authenticate){

                if(school && user.type != 'admin' && toParams.id != user.school){
                    //$state.go('page/profile', { id: $cookies.getObject('user').id });
                    params = toParams;
                    params.id = $cookies.getObject('user').school;
                    $state.transitionTo(toState.name, params, {resume: true});
                    //event.preventDefault();
                }

                if(profile && user.type != 'admin' && toParams.id != user.id){
                    params = toParams;
                    params.id = user.id;
                    //console.log('updating');
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

                    $rootScope.user = {
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        school: user.school,
                        phone: user.phone,
                        type: user.type
                    };

                    if(StorageService.isEmpty()){ StorageService.load();}
                }, function(error) {
                    //console.log('App Controller',error);
                    AuthService.clear();
                    delete $rootScope.user;
                    
                    $state.transitionTo('page/signin');
                    event.preventDefault(); 
                });
            }
        });

    
        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $cookies.putObject('state',currentRoute);
            if (currentRoute.authenticate && !AuthService.isAuthenticated() && !$rootScope.hasOwnProperty('user')){
                //console.log('stateChangeError: not auth');
                AuthService.clear();
                delete $rootScope.user;
                
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