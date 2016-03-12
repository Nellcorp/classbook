(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider,$httpProvider) {
            var routes, setRoutes;
            
            routes = [
                'app/calendar',
                'form/elements',
                'form/validation',
                'form/wizard',
                'map/maps',
                'page/404',
                'page/500',
                'page/admin/list',
                'page/admin/new',
                'page/admin/profile/:id',
                'page/change-password',
                'page/class',
                'page/schedule/profile/:id',
                'page/course/profile/:id',
                'page/course/subject/batch/:id',
                'page/course/schedule/batch/:id',
                'page/course/subject/new/:id',
                'page/course/subjects/:id',
                'page/course/students/:id',
                'page/edit-profile',
                'page/forgot-password',
                'page/lock-screen',
                'page/manager/list',
                'page/manager/new',
                'page/manager/profile/:id',
                //'page/profile',
                'page/profile/:id',
                'page/professor/profile/:id',
                'page/professor/schedules/:id',
                'page/professor/absences/:id',
                'page/reset/:id',
                'page/school/course/batch/:id',
                'page/school/course/new/:id',
                'page/school/courses/:id',
                'page/school/list',
                'page/school/professor/batch/:id',
                'page/school/professor/new/:id',
                'page/school/professors/:id',
                'page/school/profile/:id',
                'page/school/student/batch/:id',
                'page/school/student/new/:id',
                'page/school/students/:id',
                'page/school/subject/batch/:id',
                'page/school/subject/new/:id',
                'page/school/subjects/:id',
                'page/signin',
                'page/signup',
                'page/session/profile/:id',
                'page/student/profile/:id',
                'page/student/absences/:id',
                'page/subject/profile/:id',
                'page/subject/schedule/new/:id',
                'page/subject/schedule/batch/:id',
                'page/subject/schedules/:id',
                'page/subject/students/:id',
                'page/subject/sessions/:id',
                'page/schedule/sessions/:id',
                'page/schedule/students/:id',
                'page/schedule/session/new/:id/:user',
                'table/dynamic',
                'table/responsive',
                'table/static',
                'ui/buttons',
                'ui/cards',
                'ui/components',
                'ui/grids',
                'ui/icons',
                'ui/lists',
                'ui/pricing-tables',
                'ui/timeline',
                'ui/typography',
                'ui/widgets'
            ]

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                route = route.split("/:")[0];
                var auth = true;

                var open = ['page/404','page/500','page/signin','page/signup','page/reset/:id'];

                if(open.indexOf(route) > -1){ auth = false; }


                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html',
                    authenticate: auth
                };

                $stateProvider.state(route, config);
                return $stateProvider;
            };

            routes.forEach(function(route) {
            return setRoutes(route);
            });

            $urlRouterProvider
                .when('/', '/page/signin') //send root path to login page
                .otherwise('/page/404');//send invalid routes to login page


            $stateProvider.state('profile', {
                url: '/page/profile',
                templateUrl: 'app/page/profile.html'
            });

            $httpProvider.defaults.withCredentials = true;

        }]
    );

})(); 