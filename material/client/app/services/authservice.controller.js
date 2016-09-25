(function() {
    'use strict';
    var api = 'http://classbook.co:3002';
    angular.module('app.service')
        .factory("AuthService", ["$resource", "$cookies", "$location", "StorageService", "moment",
            function($resource, $cookies, $location, StorageService, moment) {
                var authService = {};
                authService.register = $resource(api + "/auth/register");
                authService.login = $resource(api + "/auth/login");
                authService.logout = $resource(api + "/auth/logout");
                authService.auth = $resource(api + "/auth/valid");
                authService.password = $resource(api + "/auth/password");
                authService.reset = $resource(api + "/auth/reset");
                authService.restore = $resource(api + "/auth/restore");
                authService.token = $resource(api + "/auth/tokens/:id", {
                    Id: "@id"
                });

                authService.isAuthenticated = function() {
                    return (!!$cookies.get('auth'));
                };

                authService.clear = function() {
                    $cookies.putObject('user', {
                        id: '',
                        email: '',
                        firstname: '',
                        lastname: '',
                        school: '',
                        phone: '',
                        type: ''
                    });
                    $cookies.put('auth', 'false');
                    StorageService.clear();
                };

                authService.checkSession = function() {
                    var exp = moment(new Date()).tz('Africa/Luanda');
                    exp.add(5, 'hours');
                    authService.auth.get(function(user) {
                        $cookies.putObject('user', {
                            id: user._id,
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            school: user.school,
                            phone: user.phone,
                            type: user.type
                        }, {
                            'expires': exp.toDate()
                        });

                        $cookies.put('auth', 'true', {
                            'expires': exp.toDate()
                        });

                    }, function(error) {

                        authService.clear();
                        $location.url('/page/signin');
                    });
                };

                return authService;
            }
        ]);
})();