(function () {
    'use strict';

    angular.module('app.page')
        .directive('customPage', customPage);


    // add class for specific pages to achieve fullscreen, custom background etc.
    function customPage() {
        var directive = {
            restrict: 'A',
            controller: ['$scope', '$element', '$location', '$state', customPageCtrl]
        };

        return directive;

        function customPageCtrl($scope, $element, $location, $state) {
            var addBg, path;

            path = function() { return $state.current.name; };

            addBg = function(path) {
                $element.removeClass('body-wide body-err body-lock body-auth');
                
                switch (path) {
                    case '404':
                    case 'page/404':
                    case 'page/500':
                        return $element.addClass('body-wide body-err');
                    case 'page/signin':
                    case 'page/signup':
                    case 'page/reset':
                    case 'page/forgot-password':
                        return $element.addClass('body-wide body-auth');
                    case 'page/lock-screen':
                        return $element.addClass('body-wide body-lock');
                }
            };

            addBg(path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return addBg(path());
            });
        }        
    }
 
})(); 


