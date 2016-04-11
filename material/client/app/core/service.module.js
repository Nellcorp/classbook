(function () {
    'use strict';
    var api ='http://classbook.co:3002';
    angular.module('app.service', ['ngCookies','ngStorage'])
        .config(['$localStorageProvider', function ($localStorageProvider) { $localStorageProvider.setKeyPrefix('classbook-'); }])
        .config(['$sessionStorageProvider', function ($sessionStorageProvider) { $sessionStorageProvider.setKeyPrefix('classbook-'); }])
        .factory("UserService", function ($resource){return $resource(api+"/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource(api+"/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource(api+"/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource(api+"/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("ScheduleService", function ($resource){return $resource(api+"/schedules/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SessionService", function ($resource){return $resource(api+"/sessions/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseNameService", function ($resource){return $resource(api+"/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectNameService", function ($resource){return $resource(api+"/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("AbsenceService", function ($resource){return $resource(api+"/absences/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("UtilityService", function ($resource){
          var utility = {};
          String.prototype.ucfirst = function(){ return this.charAt(0).toUpperCase() + this.substr(1);};
          //utility.ucfirst = function (string) { return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase(); };

          return utility;
        })
        .factory("StorageService", function ($resource, $cookies, $sessionStorage, CourseService, UserService, SchoolService, SubjectService){
          var session = {};
          var user = $cookies.getObject('user');
          session.load = function () {
            if(!!user && user.type == 'admin'){
              SchoolService.query({},function(response) { $sessionStorage.schools = response; });
              CourseService.query({},function(response) { $sessionStorage.courses = response; });
              SubjectService.query({},function(response) { $sessionStorage.subjects = response; });
              UserService.query({},function(response) { $sessionStorage.users = response; });
            }else{
              SchoolService.get({id: user.school},function(response) { $sessionStorage.schools = [response]; });
              CourseService.query({school: user.school},function(response) { $sessionStorage.courses = response; });
              SubjectService.query({school: user.school},function(response) { $sessionStorage.subjects = response; });
              UserService.query({school: user.school},function(response) { $sessionStorage.users = response; });              
            }
          };

          session.clear = function () { $sessionStorage.$reset();};

          session.isEmpty = function () {
            if(!!$sessionStorage.schools && !!$sessionStorage.courses && !!$sessionStorage.subjects && !!$sessionStorage.users){
              return false;
            }
            return true;
          };

          session.schools = function () { return $sessionStorage.schools;};
          session.courses = function () { return $sessionStorage.courses;};
          session.subjects = function () { return $sessionStorage.subjects;};
          session.users = function () { return $sessionStorage.users;};

          return session;

        })
        .factory("AuthService", function ($resource, $cookies, $location, StorageService) {
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
          StorageService.clear();
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