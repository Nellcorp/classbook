(function () {
    'use strict';

    angular.module('app.service', ['ngCookies'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("ScheduleService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schedules/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SessionService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/sessions/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory('AuthService', function ($resource, $cookies, $location) {
  			var authService = {};
        authService.register = $resource("http://classbook.nellcorp.com:3002/auth/register");
  			authService.login = $resource("http://classbook.nellcorp.com:3002/auth/login");
  			authService.logout = $resource("http://classbook.nellcorp.com:3002/auth/logout");
  			authService.auth = $resource("http://classbook.nellcorp.com:3002/auth/valid");
        authService.password = $resource("http://classbook.nellcorp.com:3002/auth/password");
        authService.reset = $resource("http://classbook.nellcorp.com:3002/auth/reset");
        authService.restore = $resource("http://classbook.nellcorp.com:3002/auth/restore");
        authService.token = $resource("http://classbook.nellcorp.com:3002/auth/tokens/:id",{Id: "@id" });
 
  			authService.isAuthenticated = function () { return (!!$cookies.get('auth')); };

        authService.clear = function () {
          $cookies.putObject('user',{ id: '', email: '', firstname: '', lastname: '', school: '', phone: '', type: '' });
          $cookies.put('auth','false');
        };

  			authService.checkSession = function () {
  				var exp = new Date();
            	exp.setDate(exp.getDate() + 1);
  				authService.auth.get(function(user) {
  					$cookies.putObject('user',{
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        school: user.school,
                        phone: user.phone,
                        type: user.type
                    }, {'expires': exp});

                    $cookies.put('auth','true', {'expires': exp});

                }, function(error) {
                
                authService.clear();
                $location.url('/page/signin');
            });
		};
 
  			return authService;
		});
})(); 