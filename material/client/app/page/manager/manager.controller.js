(function () {
    'use strict';

    angular.module('app.manager', ['app.service','validation.match','angularRandomString','xlsx-model'])
        .controller('createManagerCtrl', ['$scope','$location','randomString', 'UserService','SchoolService', 'AuthService', 'StorageService', createManagerCtrl])
        .controller('managerCtrl', ['$scope','$location','randomString', 'UserService','SchoolService', 'AuthService', '$stateParams',managerCtrl])
        .controller('importCtrl', ['$scope','$q','$location','randomString','UserService','AuthService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','AbsenceService','ErrorService','StorageService','$stateParams',importCtrl]);


    function createManagerCtrl ($scope, $location, randomString, UserService, SchoolService, AuthService, StorageService) {
        
        //$scope.user = UserService.get({id: "56b8d11c98a3eae30a734ac6"});
        $scope.phones = [];
        UserService.query({},function(users) {
            console.log(users);
            for (var i = 0; i < users.length; i++) {
                $scope.phones.push(users[i].phone);
            };
        });

        var orig_user, orig_school;

        $scope.user = {
            firstname: '',
            lastname: '',
            school: '',
            phone: '',
            type: 'manager',
            email: '',
            password: randomString()
        }   

        $scope.school = {
            name: '',
            country: 'Angola',
            city: '',
            address: '',
            manager: '',
            semesters: {
                first: {start: '', end: ''},
                second: {start: '', end: ''}
            }
        }

        orig_user = angular.copy($scope.user);
        orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() {
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;
            var users = StorageService.users();
            var schools = StorageService.schools();
            var validate_phone = false;
            
            if(!$scope.user.phone || !phone.test($scope.user.phone) || !phone.test($scope.school.phone) || $scope.phones.indexOf($scope.user.phone) > -1){return false;}
            if(!$scope.user.firstname || !$scope.user.lastname || !$scope.user.email || !$scope.school.name || !$scope.school.address || !$scope.school.city){return false;}
            for( var i = 0; i < schools.length; i++ ) { if($scope.school.phone == schools[i].phone || $scope.school.name == schools[i].name){ return false;} }
            if($scope.school.semesters.second.end <= $scope.school.semesters.second.start){return false}
            if($scope.school.semesters.first.end <= $scope.school.semesters.first.start){return false}
            if($scope.school.semesters.first.end >= $scope.school.semesters.second.start){return false}
            
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };    
        
        $scope.submitForm = function() {
            //console.log($scope.school);    
            SchoolService.save($scope.school,function(school){ 
        
                $scope.user.school = school._id;
        
                AuthService.register.save($scope.user,function(user){ 
                $scope.user = user;
                StorageService.load();
                $location.url('/page/manager/profile/'+$scope.user._id);});
                
        });
        };           
    }

    function managerCtrl ($scope, $location, randomString, UserService, SchoolService, AuthService, $stateParams) {
        $scope.id = $stateParams.id;
        
        UserService.get({id: $scope.id},function(user) {
            $scope.user = user;
            SchoolService.get({id: user.school},function(school) {
                console.log(school);
                $scope.school = school;
            }); 
        });
        

        var orig_user = angular.copy($scope.user);
        var orig_school = angular.copy($scope.school);

        $scope.canSubmit = function() { 
            return $scope.userForm.$valid && !angular.equals($scope.user, orig_user) && !angular.equals($scope.school, orig_school);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            
            UserService.update({id: $scope.user._id},$scope.user,function(user){ console.log(user);});

        };           
        
        
    }

    function importCtrl ($scope,$q,$location,randomString,UserService,AuthService,SchoolService,CourseService,SubjectService,ScheduleService,SessionService,AbsenceService,ErrorService,StorageService,$stateParams) {
        $scope.id = StorageService.me().school;
        
        SchoolService.get({id: $scope.id},function(school) {$scope.school = school;});
        
        StorageService.load();

            $scope.existing_courses = StorageService.courses_by_name();
            $scope.existing_subjects = StorageService.subjects_by_coursename();
            $scope.existing_users = StorageService.users_by_phone();
            $scope.existing_emails = StorageService.users_by_email(); 
            //console.log('Existing Courses',$scope.existing_courses);   
        
        
        
        $scope.courses = {}; $scope.subjects = {}; $scope.professors = {}; $scope.students = {}; $scope.schedules = {};
        $scope.courses_valid = false; $scope.subjects_valid = false; $scope.professors_valid = false; $scope.students_valid = false; $scope.schedules_valid = false;
        $scope.courses_done = false; $scope.subjects_done = false; $scope.professors_done = false; $scope.students_done = false; $scope.schedules_done = false;
        
        var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var phone = /^\d{9}$/; var school = /^[0-9a-fA-F]{24}$/; var time = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        $scope.validate_courses = function() {
            var data = 'cursos';
            //console.log('validating courses', $scope.data[data]);
            //debugger;

            if(!$scope.data.hasOwnProperty(data)){ return false;}
            var keys = ['curso','nome','apelido','email','telefone','descricao'];
            //console.log(data,$scope.data[data].length);

            for( var i = 0; i < $scope.data[data].length; i++ ) {

                var temp = $scope.data[data][i];
                var fields = Object.keys(temp);
                
                for (var j = 0; j < keys.length; j++) {
                    if(fields.indexOf(keys[j]) == -1 || !temp[keys[j]]){return false;}
                    if(keys[j] == 'telefone' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_professor' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_encarregado' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email_encarregado' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'time' && !time.test(temp[keys[j]])){return false;}
                };

            //console.log('validated course fields', temp);

                if($scope.existing_courses.hasOwnProperty(temp.curso)){ return false;}
                
                //console.log('course is unique', $scope.existing_courses);

                $scope.courses[temp.curso] = {
                                    name: temp.curso, school: $scope.id, description: temp.descricao,
                                    supervisor: { firstname: temp.nome, lastname: temp.apelido, email: temp.email, phone: temp.telefone }
                            };
            }
            //console.log('validated courses', $scope.data[data]);
            $scope.courses_valid = true;
            return $scope.validate_subjects();
        };

        $scope.insertCourses = function() {
            var promises = [];
            var courses = {};
                angular.forEach($scope.courses, function(value, key) {
                    promises.push(CourseService.save(value,function(response){ courses[response.name] = response; }).$promise);
                });
            
            $q.all(promises).then(function(){
                    $scope.courses_done = true;
                    return $scope.insertSubjects(courses);
                
            });
        };

        $scope.validate_subjects = function() {
            //Assume $scope.courses is ready
            var data = 'disciplinas';
            //console.log('validating subjects', $scope.data[data]);

            if(!$scope.data.hasOwnProperty(data)){ return false;}
            var keys = ['disciplina','curso','ano','descricao'];

            for( var i = 0; i < $scope.data[data].length; i++ ) {
                var temp = $scope.data[data][i];
                var fields = Object.keys(temp);
                
                for (var j = 0; j < keys.length; j++) {
                    if(fields.indexOf(keys[j]) == -1 || !temp[keys[j]]){return false;}
                    if(keys[j] == 'telefone' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_professor' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_encarregado' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email_encarregado' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'time' && !time.test(temp[keys[j]])){return false;}
                };
                
                if(temp.ano < 1 || temp.ano > 5){ return false;}
                //console.log('validated subject fields', temp);

                //Ensure course exists
                if(!$scope.existing_courses.hasOwnProperty(temp.curso) && !$scope.courses.hasOwnProperty(temp.curso)){ return false; }

                //Ensure subject does not yet exist for this course
                if($scope.existing_subjects.hasOwnProperty(temp.curso+'_'+temp.disciplina)){return false;}
                
                $scope.subjects[temp.curso+'_'+temp.disciplina] = {name: temp.disciplina, school: $scope.id, description: temp.descricao, year: temp.ano, course: temp.curso };
            }
            
            //console.log('validated subjects', $scope.data[data]);
            $scope.subjects_valid = true;
            return $scope.validate_professors();
        };    
        
$scope.insertSubjects = function(courses) {
            //Assume courses have already been inserted
            $scope.existing_courses = courses;

            var subjects = {};
            var promises = [];
                //Check if I really have the course ID
                //console.log('Courses',$scope.existing_courses);
                angular.forEach($scope.subjects, function(value, key) {
                    var course = value.course;
                    value.course = $scope.existing_courses[course];
                    promises.push(SubjectService.save(value,function(response){
                        //console.log(response);
                        subjects[course+'_'+response.name] = response;
                    }).$promise);
                });
            
            $q.all(promises).then(function(){
                $scope.subjects_done = true;
                return $scope.insertProfessors(courses, subjects);
            });
        };

        $scope.validate_professors = function() {
            var data = 'professores';
            //console.log('validating professors', $scope.data[data]);
            if(!$scope.data.hasOwnProperty(data)){ return false;}
            var keys = ['nome','apelido','email','telefone','descricao'];

            for( var i = 0; i < $scope.data[data].length; i++ ) {
                var temp = $scope.data[data][i];
                var fields = Object.keys(temp);
                
                for (var j = 0; j < keys.length; j++) {
                    if(fields.indexOf(keys[j]) == -1 || !temp[keys[j]]){return false;}
                    if(keys[j] == 'telefone' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_professor' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_encarregado' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email_encarregado' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'time' && !time.test(temp[keys[j]])){return false;}
                };

                if(!temp.hasOwnProperty('nome') || !temp.hasOwnProperty('apelido') || !temp.hasOwnProperty('email') || !temp.hasOwnProperty('telefone') || !temp.hasOwnProperty('descricao')){ return false;}
                if(!temp.nome || !temp.apelido || !temp.telefone || !temp.email || !temp.descricao ){ return false;}
                if(!email.test(temp.email) || !phone.test(temp.telefone)){ return false;}

                if($scope.existing_users.hasOwnProperty(temp.telefone)){ return false;}
                if($scope.existing_emails.hasOwnProperty(temp.email)){ return false;}
                
                $scope.professors[temp.telefone] = {
                    firstname: temp.nome,
                    lastname: temp.apelido,
                    school: $scope.id,
                    phone: temp.telefone,
                    email: temp.email,
                    bio: temp.descricao,
                    type: 'professor',
                    password: randomString()
                };
            }
            //console.log('validated professors', $scope.data[data]);
            $scope.professors_valid = true;
            return $scope.validate_schedules();
        };    

        $scope.insertProfessors = function(courses, subjects) {
            var users = {};
            var promises = [];
                //Check if I really have the course ID
                angular.forEach($scope.professors, function(value, key) {
                    promises.push(AuthService.register.save(value,function(response){
                        //console.log(response);
                        users[response.phone] = response;
                        console.log('fucking users',users);
                    }).$promise);
                });
            
            $q.all(promises).then(function(){
                console.log('fucking users2',users);
                console.log('fucking promises',promises);
                $scope.professors_done = true;
                return $scope.insertSchedules(users, courses, subjects);
            });
        };

        $scope.validate_schedules = function() {
            //Assume $scope.professors, $scope.courses and $scope.subjects are ready
            var data = 'horarios';
            //console.log('validating schedules', $scope.data[data]);
            if(!$scope.data.hasOwnProperty(data)){ return false;}
            var keys = ['curso','disciplina','telefone_professor','segunda1','segunda2','terca1','terca2','quarta1','quarta2','quinta1','quinta2','sexta1','sexta2'];
            

            //course,subject,phone,08:00,10:00,00:00,00:00,08:00,10:00,08:00,10:00,08:00,10:00
            for( var i = 0; i < $scope.data[data].length; i++ ) {
                var temp = $scope.data[data][i];
                var fields = Object.keys(temp);
                var subject = {};
                var course = {};
                var professor = {};
                
                for (var j = 0; j < keys.length; j++) {
                    if(fields.indexOf(keys[j]) == -1 || !temp[keys[j]]){return false;}
                    if(keys[j] == 'telefone' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_professor' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_encarregado' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email_encarregado' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'time' && !time.test(temp[keys[j]])){return false;}
                };
                
                //console.log('validated schedule fields', temp);
                
                //Ensure professor exists
                if($scope.existing_users.hasOwnProperty(temp.telefone_professor)){
                    professor = $scope.existing_users[temp.telefone_professor];
                }else if($scope.professors.hasOwnProperty(temp.telefone_professor)){
                    professor = $scope.professors[temp.telefone_professor];
                }else{ return false; }

                //console.log('validated schedule professor', temp);

                //Ensure subject
                if($scope.existing_subjects.hasOwnProperty(temp.curso+'_'+temp.disciplina)){
                    subject = $scope.existing_subjects[temp.curso+'_'+temp.disciplina];
                }else if($scope.subjects.hasOwnProperty(temp.curso+'_'+temp.disciplina)){
                    subject = $scope.subjects[temp.curso+'_'+temp.disciplina];
                }else{ return false; }

                //console.log('validated schedule subject', temp);

                //Ensure course
                if($scope.existing_courses.hasOwnProperty(temp.curso)){
                    course = $scope.existing_courses[temp.curso];
                }else if($scope.courses.hasOwnProperty(temp.curso)){
                    course = $scope.courses[temp.curso];
                }else{ return false; }

                
                //console.log('validated schedule course', temp);

                var temp_schedule = {
                    subject: temp.disciplina,
                    professor: temp.telefone_professor,
                    school: $scope.id,
                    course: temp.curso,
                    absences: [],
                    schedule: {
                        monday: {start: temp.segunda1,end: temp.segunda2},
                        tuesday: {start: temp.terca1,end: temp.terca2},
                        wednesday: {start: temp.quarta1,end: temp.quarta2},
                        thursday: {start: temp.quinta1,end: temp.quinta2},
                        friday: {start: temp.sexta1,end: temp.sexta2}
                    }
                };

                var weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
                var temp2 = new Date();
                var offset = -60;

                if(temp2.getTimezoneOffset() == offset){ var today = temp2;}else{
                    var utc = temp2.getTime() + (temp2.getTimezoneOffset() * 60000);
                    var today = new Date(utc - (3600000*offset));
                }

                var schedule = temp_schedule.schedule;
                var first_start = new Date($scope.school.semesters.first.start);
                var first_end = new Date($scope.school.semesters.first.end);
                var second_start = new Date($scope.school.semesters.second.start);
                var second_end = new Date($scope.school.semesters.second.end);
                var locale = today.toLocaleString();
                
                if(today < first_end){
                    var start = first_start;
                    var end = first_end;
                } else if (today >= first_end && today < second_end ){
                    var start = second_start;
                    var end = second_end;
                }

                var sessions = [];
                
                for (var k = 1; k <= 5; k++) {
                    var weekday = weekdays[j];
                    
                        if (schedule.hasOwnProperty(weekday) && schedule[weekday].start != '' && schedule[weekday].end != '') {

                            var start_weekday = start.getDay(); //index
                            var session_weekday = weekdays.indexOf(weekday);
                            var diff = (start_weekday < session_weekday)? session_weekday - start_weekday : start_weekday - session_weekday + 7;

                            var start_str = schedule[weekday].start.split( ":" );
                            var end_str = schedule[weekday].end.split( ":" );
                            var session_date = new Date(start.getFullYear(),start.getMonth(),start.getDate(),start_str[0],start_str[1]);
                            var start_date = new Date(session_date.setTime( session_date.getTime() + diff * 86400000 ));
                            var current = start_date;
                            var next = new Date(session_date.setTime( session_date.getTime() + 7 * 86400000 ));
                            //create professor absences until temp date + 7 is greater than end date
                            
                            var absence = {
                                    user: temp_schedule.professor,
                                    phone: temp_schedule.professor,
                                    school: $scope.id,
                                    year: subject.year,
                                    schedule: '',
                                    type: 'professor',
                                    course: course.name,
                                    subject: subject.name,
                                    supervisor_phone: course.supervisor.phone,
                                    message:'O professor '+professor.firstname+' '+professor.lastname+' faltou à aula de '+subject.name,
                                    supervisor_message: 'O professor '+professor.firstname+' '+professor.lastname+' faltou à aula de '+subject.name,
                                    time: []
                                };

                            while( next <= end ){
                                var current_locale = current.toLocaleString();
                                var message = 'O professor '+professor.firstname+' '+professor.lastname+' faltou à aula de '+subject.name;
                                var supervisor_message = 'O professor '+professor.firstname+' '+professor.lastname+' faltou à aula de '+subject.name;
                                var end_time = current;
                                end_time.setHours(parseInt(end_str[0]), parseInt(end_str[1]));
                                absence.time.push({ start: current, end: end_time, late: 20, message: message, supervisor_message: supervisor_message });

                                var current = next;
                                var next = new Date(current.setTime( current.getTime() + 7 * 86400000 ));
                            }

                            temp_schedule.absences.push(absence);
                        }
                }
                
                $scope.schedules[temp_schedule.course+'_'+temp_schedule.subject+'_'+temp_schedule.professor] = temp_schedule;
            }
            //console.log('validated schedules', $scope.data[data]);
            $scope.schedules_valid = true;
            return $scope.validate_students();
        };
        
        $scope.insertSchedules = function(users, courses, subjects) {
            //Assume courses, subjects and professors have been inserted
            $scope.existing_users = users;
            $scope.existing_subjects = subjects;
            $scope.existing_courses = courses;
            console.log('Schedule Users',users);
            //course,subject,email,08:00,10:00,00:00,00:00,08:00,10:00,08:00,10:00,08:00,10:00
            var promises = [];
                //Check if I really have the course ID
                angular.forEach($scope.schedules, function(schedule, key) {
                    var absences = schedule.absences;
                    //console.log(absences);
                    delete schedule.absences;

                    //Get subject, professor and course ids
                    schedule.professor = $scope.existing_users[schedule.professor];
                    schedule.subject = $scope.existing_subjects[schedule.course+'_'+schedule.subject];
                    schedule.course = $scope.existing_courses[schedule.course];
                    promises.push(ScheduleService.save(schedule,function(response){
                        console.log(response);

                        for(var j = 0; j < absences.length; j++){
                            //Get user, course, subject ids
                            absences[j].schedule = response._id;
                            absences[j].user = response.professor;
                            absences[j].subject = response.subject;
                            absences[j].course = response.course;
                            AbsenceService.save(absences[j],function(response){ console.log(response)},function(error){ console.log(error)});
                        }
                    }).$promise);
                });
           
            $q.all(promises).then(function(){
                StorageService.load();
                $scope.schedules_done = true;
                return $scope.insertStudents(users, courses);
            });
        };
        
        $scope.validate_students = function() {
            //Assume $scope.courses is ready
            var data = 'estudantes';
            //console.log('validating students', $scope.data[data]);

            if(!$scope.data.hasOwnProperty(data)){ return false;}
            var keys = ['nome','apelido','email','telefone','nome_encarregado','apelido_encarregado','email_encarregado','telefone_encarregado','curso','ano'];

            for( var i = 0; i < $scope.data[data].length; i++ ) {
                var temp = $scope.data[data][i];
                var fields = Object.keys(temp);
                
                for (var j = 0; j < keys.length; j++) {
                    if(fields.indexOf(keys[j]) == -1 || !temp[keys[j]]){return false;}
                    if(keys[j] == 'telefone' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_professor' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'telefone_encarregado' && !phone.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email_encarregado' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'email' && !email.test(temp[keys[j]])){return false;}
                    if(keys[j] == 'time' && !time.test(temp[keys[j]])){return false;}
                };
                
                if(temp.ano < 1 || temp.ano > 5){ return false;}
                
                //Ensure course exists
                if(!$scope.existing_courses.hasOwnProperty(temp.curso) && !$scope.courses.hasOwnProperty(temp.curso)){ return false; }

                //Ensure user does not yet exist
                if($scope.existing_users.hasOwnProperty(temp.telefone)){ return false;}
                if($scope.existing_emails.hasOwnProperty(temp.email)){ return false;}
                
                $scope.students[temp.telefone] = {
                        firstname: temp.nome, lastname: temp.apelido, school: $scope.id, course: temp.curso, phone: temp.telefone, email: temp.email, type: 'student',
                        year: temp.ano, supervisor:{firstname: temp.nome_encarregado, lastname: temp.apelido_encarregado,email: temp.email_encarregado,
                        phone: temp.telefone_encarregado},password: randomString()
                };
            }

            //console.log('validated students', $scope.data[data]);
            $scope.students_valid = true;
            return $scope.students_valid;
        }; 

        $scope.insertStudents = function(users, courses) {
            
            $scope.existing_users = users;
            $scope.existing_courses = courses;
            var promises = [];
            //Assume courses exist
                angular.forEach($scope.students, function(student, key) {
                    student.course = $scope.existing_courses[student.course];
                    promises.push(UserService.save(student,function(response){console.log(response);}).$promise);
                });
            $q.all(promises).then(function(){
                $scope.students_done = true;
                return $scope.students_done;
            });
        };              
        
        $scope.canSubmit = function() {
            //console.log('checking file',$scope.data);
            if(!$scope.hasOwnProperty('data')){return false;}
            //console.log('found data',$scope.data);

            var keys = ['cursos','disciplinas','professores','horarios','estudantes'];
            var fields = Object.keys($scope.data);

            //console.log('available fields',fields);
            var valid = false;
            
            for (var i = 0; i < keys.length; i++) {
                //console.log('Validating ',keys[i]);
                if(fields.indexOf(keys[i]) == -1 || $scope.data[keys[i]].length == 0 ){ return false;}
                //console.log('Validated ',keys[i]);
            };


            valid = $scope.validate_courses();
            //console.log('VALID: ',valid);
            return valid;
        };    
        
        $scope.submitForm = function() {
            var done = $scope.insertCourses();
            $scope.$watch('students_done', function(newValue, oldValue) {
                var promises = StorageService.load();

                $q.all(promises).then(function(){
                    if(newValue){ $location.url('/page/profile/'+StorageService.me().type); }
                });
                
            });
        };           
        
        
    }



})();
