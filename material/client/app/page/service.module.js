(function () {
    'use strict';

    angular.module('app.service', ['ngCookies'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory('AuthService', function ($resource, $cookies) {
  			var authService = {};
  			authService.login = $resource("http://classbook.nellcorp.com:3002/users/login");
  			authService.logout = $resource("http://classbook.nellcorp.com:3002/users/logout");
 
  			authService.isAuthenticated = function () { return (!!$cookies.get('auth') && !!$cookies.getObject('user')); };
 
  			return authService;
		});
})(); 