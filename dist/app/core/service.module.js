(function () {
    'use strict';
    var api ='http://classbook.co:3002';
    angular.module('app.service', ['ngCookies'])
        .factory("UserService", function ($resource){return $resource(api+"/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource(api+"/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource(api+"/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource(api+"/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("ScheduleService", function ($resource){return $resource(api+"/schedules/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SessionService", function ($resource){return $resource(api+"/sessions/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseNameService", function ($resource){return $resource(api+"/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectNameService", function ($resource){return $resource(api+"/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("AbsenceService", function ($resource){return $resource(api+"/absences/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("AuthService", function ($resource, $cookies, $location) {
  			var authService = {};
        authService.register = $resource(api+"/auth/register");
  			authService.login = $resource(api+"/auth/login");
  			authService.logout = $resource(api+"/auth/logout");
  			authService.auth = $resource(api+"/auth/valid");
        authService.password = $resource(api+"/auth/password");
        authService.reset = $resource(api+"/auth/reset");
        authService.restore = $resource(api+"/auth/restore");
        authService.token = $resource(api+"/auth/tokens/:id",{Id: "@id" });
 
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