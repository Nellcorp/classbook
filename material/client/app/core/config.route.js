(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var routes, setRoutes;

            routes = [
                'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                'map/maps',
                'table/static', 'table/dynamic', 'table/responsive',
                'form/elements', 'form/validation', 'form/wizard',
                'page/404', 'page/500', 'page/forgot-password','page/change-password', 'page/lock-screen', 'page/edit-profile','page/profile', 'page/signin', 'page/signup','page/class',
                'app/calendar'
            ]

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html'
                };
                $stateProvider.state(route, config);
                return $stateProvider;
            };

            routes.forEach(function(route) {
            return setRoutes(route);
            });

            $urlRouterProvider
                .when('/', '/page/signin')
                .otherwise('/page/signin');


            $stateProvider.state('profile', {
                url: '/page/profile',
                templateUrl: 'app/page/profile.html'
            });

        }]
    );

})(); 