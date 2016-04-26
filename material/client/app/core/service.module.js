(function () {
    'use strict';
    var api ='http://classbook.co:3002';
    angular.module('app.service', ['ngCookies','ngStorage'])
        .config(['$localStorageProvider', function ($localStorageProvider) { $localStorageProvider.setKeyPrefix('classbook-'); }])
        .config(['$sessionStorageProvider', function ($sessionStorageProvider) { $sessionStorageProvider.setKeyPrefix('classbook-'); }])
        .factory("UserService", function ($resource, $state){
          console.log($state);
          return $resource(api+"/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
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
        .factory("StorageService", function ($resource, $cookies, $sessionStorage, CourseService, UserService, SchoolService, SubjectService, ScheduleService){
          var session = {};
          var user = $cookies.getObject('user');
          session.load = function () {
            if(!!user){
              if(user.type == 'admin'){
                //console.log(JSON.stringify(response));
                SchoolService.query({},function(response) { $sessionStorage.schools = response; });
                CourseService.query({},function(response) { $sessionStorage.courses = response; });
                SubjectService.query({},function(response) { $sessionStorage.subjects = response; });
                UserService.query({},function(response) { $sessionStorage.users = response; });
                $sessionStorage.schedules = [];
              }else if(user.type == 'manager' || user.type == 'professor' || user.type == 'student') {
                SchoolService.get({id: user.school},function(response) { $sessionStorage.schools = [response];});
                CourseService.query({school: user.school},function(response) { $sessionStorage.courses = response; });
                SubjectService.query({school: user.school},function(response) { $sessionStorage.subjects = response; });
                UserService.query({school: user.school},function(response) { $sessionStorage.users = response; });
                ScheduleService.query({school: user.school},function(response) { $sessionStorage.schedules = response; });
            }
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
          session.schedules = function () { return $sessionStorage.schedules;};

          session.courses_by_name = function () {
            var result = {};
            for(var i = 0; i < $sessionStorage.courses.length;i++){ result[$sessionStorage.courses[i].name] = $sessionStorage.courses[i]; }
            return result;
         };

         session.course_by_id = function (id) {
            var result = {};
            for(var i = 0; i < $sessionStorage.courses.length;i++){ if($sessionStorage.courses[i]._id == id){return $sessionStorage.courses[i]; break;}}
              return false;
         };

         session.subject_by_id = function (id) {
            var result = {};
            for(var i = 0; i < $sessionStorage.subjects.length;i++){ if($sessionStorage.subjects[i]._id == id){return $sessionStorage.subjects[i]; break;}}
              return false;
         };

         session.schedule_by_id = function (id) {
            var result = {};
            for(var i = 0; i < $sessionStorage.schedules.length;i++){ if($sessionStorage.schedules[i]._id == id){return $sessionStorage.schedules[i]; break;}}
              return false;
         };

         session.subjects_by_name = function () {
            var result = {};
            for(var i = 0; i < $sessionStorage.subjects.length;i++){ result[$sessionStorage.subjects[i].course+'_'+$sessionStorage.subjects[i].name] = $sessionStorage.subjects[i]; }
            return result;
         };

         session.users_by_phone = function () {
            var result = {};
            for(var i = 0; i < $sessionStorage.users.length;i++){ result[$sessionStorage.users[i].phone] = $sessionStorage.users[i]; }
            return result;
         };

         session.school_by_id = function (id) {
            var result = {};
            for(var i = 0; i < $sessionStorage.schools.length;i++){ if($sessionStorage.schools[i]._id == id){return $sessionStorage.schools[i]; break;}}
              return false;
         };

         session.user_by_id = function (id) {
            for(var i = 0; i < $sessionStorage.users.length;i++){ if($sessionStorage.users[i]._id == id){return $sessionStorage.users[i]; break;}}
              return false;
         };

         session.users_by_id = function () {
            var result = {};
            console.log($sessionStorage.users);
            for(var i = 0; i < $sessionStorage.users.length;i++){ result[$sessionStorage.users[i]._id] = $sessionStorage.users[i]; }
            return result;
         };

         session.schedules_by_user = function () {
            var result = {};
            console.log($sessionStorage.schedules);
            for(var i = 0; i < $sessionStorage.schedules.length;i++){
              if(result.hasOwnProperty($sessionStorage.schedules[i].professor)){
                result[$sessionStorage.schedules[i].professor].push($sessionStorage.schedules[i]);  
              }else{
                result[$sessionStorage.schedules[i].professor] = [$sessionStorage.schedules[i]];
              }
            }
            return result;
         };

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