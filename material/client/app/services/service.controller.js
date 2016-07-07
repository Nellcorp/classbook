(function () {
    'use strict';
    var api ='http://classbook.co:3002';
    angular.module('app.service')
        .config(['$localStorageProvider', function ($localStorageProvider) { $localStorageProvider.setKeyPrefix('classbook-'); }])
        .config(['$sessionStorageProvider', function ($sessionStorageProvider) { $sessionStorageProvider.setKeyPrefix('classbook-'); }])
        .factory("UserService", [ "$resource", "$state", function ($resource, $state){ return $resource(api+"/users/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("SchoolService", [ "$resource", function ($resource){return $resource(api+"/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("CourseService", [ "$resource", function ($resource){return $resource(api+"/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("GroupService", [ "$resource", function ($resource){return $resource(api+"/groups/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("SubjectService", [ "$resource", function ($resource){return $resource(api+"/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("ScheduleService", [ "$resource", function ($resource){return $resource(api+"/schedules/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("SessionService", [ "$resource", function ($resource){return $resource(api+"/sessions/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("CourseNameService", [ "$resource", function ($resource){return $resource(api+"/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("SubjectNameService", [ "$resource", function ($resource){return $resource(api+"/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("AbsenceService", [ "$resource", function ($resource){return $resource(api+"/absences/:id",{Id: "@id" },{"update": {method: "PUT"}});}])
        .factory("ErrorService", [ "$resource", function ($resource){
          var error = {};
          error.parse = function(err){
            var message = 'Houve um erro no seu pedido.';
            
            if(error.status == 500){
              
              if(error.data.hasOwnProperty('name') && error.data.name == 'ValidationError'){
              
                var index = Object.getOwnPropertyNames(error.data.errors)[0];
                message = error.data.errors[index].message;
              
              }else if(error.data.hasOwnProperty('message')){
                  message = error.data.message;
              }else{ message = error.data.statusText; }
            }

            if(error.status == 403){ return "Não está autorizado a realizar esta operação"; }

            if(error.status == 401){ return "Não está autenticado. Por favor, faça o login"; }

            if(error.status == 200){ return "Sucesso"; }

          }
          return error;
          
        }])
        .factory("UtilityService", [ "$resource", function ($resource){
          var utility = {};
          String.prototype.ucfirst = function(){ return this.charAt(0).toUpperCase() + this.substr(1);};
          //utility.ucfirst = function (string) { return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase(); };

          return utility;
        }])
        .factory("StatsService", [ "$resource", "$q", "StorageService", "CourseService", "UserService", "SchoolService", "SubjectService", "ScheduleService", "SessionService", "AbsenceService", function ($resource, $q, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService){
          var stats = {};
          var users = [];
          var students = 0;
          var professors = 0;
          var admins = 0;
          var users_by_id = {};
          var schools = [];
          var subjects = [];
          var courses = [];
          var schedules = [];
          var absences = [];
          var professor_absences = [];
          var student_absences = [];
          var sessions = [];

          StorageService.load();
          
          var temp = StorageService.users();
          if(typeof temp != 'undefined'){
            users = temp;
          }

          //console.log('users',users);
          
            for (var i = 0; i < users.length; i++) {
            if(users[i].type == 'student'){students +=1;}
            if(users[i].type == 'professor'){professors +=1;}
            if(users[i].type == 'admin'){admins +=1;}
          };

          users_by_id = StorageService.users_by_id();
          schools = StorageService.schools();
          subjects = StorageService.subjects();
          courses = StorageService.courses();
          schedules = StorageService.schedules();
          absences = [];
          professor_absences = [];
          student_absences = [];
          sessions = [];
          SessionService.query({},function(response) { sessions = response; });
          AbsenceService.query({},function(response) {
            absences = response;
            for (var i = 0; i < absences.length; i++) {
              var user = users_by_id[absences[i].user];
              //console.log(users_by_id);
              //console.log(response[i].user);
              if(user.type == 'student'){ student_absences.push(absences[i]);}
              if(user.type == 'professor'){ professor_absences.push(absences[i]);}
              //if(response[i].){}
            };
          });
          

          stats.users = function(){ return users.length;};
          stats.students = function(){ return students;};
          stats.professors = function(){ return professors;};
          stats.schools = function(){ return schools.length;};
          stats.admins = function(){ return admins;};
          stats.absences = function(){ return absences.length;};
          stats.professor_absences = function(){ return professor_absences.length;};
          stats.student_absences = function(){ return student_absences.length;};
          stats.sessions = function(){ return sessions.length;};
          stats.courses = function(){ return courses.length;};
          stats.subjects = function(){ return subjects.length;};

          stats.school_users = function(id){
            var school_users = 0; for (var i = 0; i < users.length; i++) { if(users[i].school == id){school_users +=1;}};
            return school_users;
          };
          stats.school_students = function(id){
            var school_users = 0; for (var i = 0; i < users.length; i++) { if(users[i].school == id && users[i].type == 'student'){school_users +=1;}};
            return school_users; 
          };
          stats.school_professors = function(id){
            var school_users = 0; for (var i = 0; i < users.length; i++) { if(users[i].school == id && users[i].type == 'professor'){school_users +=1;}};
            return school_users; 
          };
          stats.school_absences = function(id){
            var result = 0; for (var i = 0; i < absences.length; i++) { if(absences[i].school == id){result +=1;}};
            return result;
          };
          stats.school_professor_absences = function(id){
            var result = 0; for (var i = 0; i < professor_absences.length; i++) { if(professor_absences[i].school == id){result +=1;}};
            return result;
          };
          stats.school_student_absences = function(id){
            var result = 0; for (var i = 0; i < student_absences.length; i++) { if(student_absences[i].school == id){result +=1;}};
            return result;
          };
          stats.school_sessions = function(id){
            var result = 0; for (var i = 0; i < sessions.length; i++) { if(sessions[i].school == id){result +=1;}};
            return result;
          };
          stats.school_courses = function(id){
            var result = 0; for (var i = 0; i < courses.length; i++) { if(courses[i].school == id){result +=1;}};
            return result;
          };
          stats.school_subjects = function(id){
            var result = 0; for (var i = 0; i < subjects.length; i++) { if(subjects[i].school == id){result +=1;}};
            return result;
          };
          
          return stats;
        }])
        .factory("ChartService", [ "$resource", function ($resource){
          var options = {};

          var color = {
            primary:    '#009688',
            success:    '#8BC34A',
            info:       '#00BCD4',
            infoAlt:    '#7E57C2',
            warning:    '#FFCA28',
            danger:     '#F44336',
            text:       '#3D4051',
            gray:       '#EDF0F1'
        };
          
          options.labelTop = {
            normal : {
                color: color.primary,
                label : { show : true, position : 'center', formatter : '{b}', textStyle: { color: '#999', baseline : 'top', fontSize: 12 } }, labelLine : { show : false }
            }
        };
        
        options.labelFromatter = { normal : { label : { formatter : function (params){ return 100 - params.value + '%' },
                    textStyle: { color: color.text, baseline : 'bottom', fontSize: 20 } } }, };

        options.labelBottom = { normal : { color: '#f1f1f1', label : { show : true, position : 'center' }, labelLine : { show : false } } };        
        options.radius = [55, 60];


          return options;
        }])
        .factory("StorageService", [ "$resource", "$q", "$cookies", "$sessionStorage", "CourseService", "UserService", "SchoolService", "SubjectService", "ScheduleService", "ErrorService", function ($resource, $q, $cookies, $sessionStorage, CourseService, UserService, SchoolService, SubjectService, ScheduleService, ErrorService){
          var session = {};
          var user = $cookies.getObject('user');
          session.load = function () {
            if(typeof $sessionStorage.schools == 'undefined'){ $sessionStorage.schools = []; }
            if(typeof $sessionStorage.courses == 'undefined'){ $sessionStorage.courses = []; }
            if(typeof $sessionStorage.users == 'undefined'){ $sessionStorage.users = []; }
            if(typeof $sessionStorage.subjects == 'undefined'){ $sessionStorage.subjects = []; }
            
            var promises = [];
            if(!!user){
              if(user.type == 'admin'){
                //console.log(JSON.stringify(response));
                $sessionStorage.schedules = [];
                SchoolService.query({},function(response) {
                  $sessionStorage.schools = response;
                  CourseService.query({},function(response) {
                    $sessionStorage.courses = response;
                    SubjectService.query({},function(response) {
                      $sessionStorage.subjects = response;
                      UserService.query({},function(response) {
                        $sessionStorage.users = response;
                        return response;
                      });
                    });
                  });
                });
              }else if(user.type == 'manager' || user.type == 'professor' || user.type == 'student') {
                SchoolService.get({id: user.school},function(response) {
                  $sessionStorage.schools = [response];
                   CourseService.query({school: user.school},function(response) {
                      $sessionStorage.courses = response;
                      SubjectService.query({school: user.school},function(response) {
                        $sessionStorage.subjects = response;
                        UserService.query({school: user.school},function(response) {
                          $sessionStorage.users = response;
                          ScheduleService.query({school: user.school},function(response) {
                            $sessionStorage.schedules = response;
                            return response;
                          });
                        });
                      });
                    });
                  });
            }
          }
          };

          session.clear = function () { $sessionStorage.$reset();};

          session.me = function () { return user;};

          session.error = function (error) { return ErrorService.parse(error); };

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

         session.courses_by_id = function () {
            var result = {};
            for(var i = 0; i < $sessionStorage.courses.length;i++){ result[$sessionStorage.courses[i]._id] = $sessionStorage.courses[i]; }
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

         session.subjects_by_coursename = function () {
            var result = {};
            var courses = session.courses_by_id();
            for(var i = 0; i < $sessionStorage.subjects.length;i++){
              result[courses[$sessionStorage.subjects[i].course].name+'_'+$sessionStorage.subjects[i].name] = $sessionStorage.subjects[i];
            }
            return result;
         };

         session.users_by_phone = function () {
            var result = {};
            for(var i = 0; i < $sessionStorage.users.length;i++){ result[$sessionStorage.users[i].phone] = $sessionStorage.users[i]; }
            return result;
         };

         session.users_by_email = function () {
            var result = {};
            for(var i = 0; i < $sessionStorage.users.length;i++){ result[$sessionStorage.users[i].email] = $sessionStorage.users[i]; }
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
            //console.log($sessionStorage.users);
            for(var i = 0; i < $sessionStorage.users.length;i++){ result[$sessionStorage.users[i]._id] = $sessionStorage.users[i]; }
            return result;
         };

         session.schedules_by_user = function () {
            var result = {};
            //console.log($sessionStorage.schedules);
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

        }])
        .factory("AuthService", [ "$resource", "$cookies", "$location", "StorageService", function ($resource, $cookies, $location, StorageService) {
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
    }]);
})(); 