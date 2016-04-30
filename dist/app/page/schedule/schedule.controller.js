(function () {
    'use strict';

    angular.module('app.schedule', ['app.service','validation.match','angularRandomString'])
        .controller('createScheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService','AbsenceService','SchoolService','CourseService','$stateParams',createScheduleCtrl])
        .controller('subjectScheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService', '$stateParams',subjectScheduleCtrl])
        .controller('schoolScheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService', 'SchoolService', 'StorageService','$stateParams',schoolScheduleCtrl])
        .controller('profScheduleCtrl', ['$scope','$cookies','$location','UserService','SubjectService','ScheduleService', 'GroupService','$stateParams',profScheduleCtrl])
        .controller('profScheduleCtrl_noID', ['$scope','$cookies','$location','UserService','SubjectService','ScheduleService', 'GroupService','$stateParams',profScheduleCtrl_noID])
        .controller('scheduleSessionCtrl', ['$scope','$location','randomString', 'SchoolService','CourseService', 'SubjectService','$stateParams',scheduleSessionCtrl])
        .controller('createScheduleSessionCtrl', ['$scope','$location','SubjectService','SessionService','$stateParams',createScheduleSessionCtrl])
        .controller('scheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService','$stateParams',scheduleCtrl])
        .controller('batchScheduleCtrl', ['$scope','$q','$location','UserService','CourseService','SubjectService','ScheduleService','AbsenceService','StorageService','$stateParams',batchScheduleCtrl]);


    function createScheduleCtrl ($scope, $location, UserService, SubjectService, ScheduleService, AbsenceService, SchoolService, CourseService, $stateParams) {
        $scope.id = $stateParams.id;
        
        $scope.schedule = {
            subject: '',
            professor: '',
            schedule: {
                monday: { start: '', end:  '' },
                tuesday:  { start: '', end:  '' },
                wednesday:  { start: '', end:  '' },
                thursday:  { start: '', end:  '' },
                friday:  { start: '', end:  '' }
            }
        };

        $scope.email = '';


        SubjectService.get({id: $scope.id},function(subject) {
            $scope.subject = subject;
            $scope.schedule.subject = $scope.subject._id;

            SchoolService.get({id: subject.school},function(school) {
                $scope.school = school;
            });

            CourseService.get({id: subject.course},function(course) {
                $scope.course = course;
            });
        });

        

        var orig = angular.copy($scope.schedule);
    
        $scope.canSubmit = function() {
            return !!$scope.userForm && $scope.userForm.$valid && !angular.equals($scope.schedule, orig) && !!$scope.school && !!$scope.subject;
        };    
        
        $scope.submitForm = function() {

            UserService.query({email: $scope.email, type: 'professor'},function(response) {

                $scope.professor = response[0];
                $scope.schedule.professor = response[0]._id;
                $scope.schedule.course = $scope.course._id;
                console.log($scope.professor);
                //console.log($scope.schedule);
                ScheduleService.save($scope.schedule,function(response){
                    //console.log(response);

                var weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
                var temp = new Date();
                var offset = -60;

                if(temp.getTimezoneOffset() == offset){
                    var today = temp;    
                }else{
                    var utc = temp.getTime() + (temp.getTimezoneOffset() * 60000);
                    var today = new Date(utc - (3600000*offset));
                }


                var schedule = $scope.schedule.schedule;
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
                console.log($scope.schedule);
                console.log(schedule);
                
                for (var i = 1; i <= 5; i++) {
                    var weekday = weekdays[i];
                    
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
                                    user: $scope.professor._id,
                                    phone: $scope.professor.phone,
                                    school: $scope.professor.school,
                                    year: $scope.subject.year,
                                    schedule: $scope.schedule._id,
                                    course: $scope.subject.course,
                                    subject: $scope.subject._id,
                                    supervisor_phone: $scope.course.supervisor.phone,
                                    message:'O professor '+$scope.professor.firstname+' '+$scope.professor.lastname+' faltou à aula de '+$scope.subject.name,
                                    supervisor_message: 'O professor '+$scope.professor.firstname+' '+$scope.professor.lastname+' faltou à aula de '+$scope.subject.name,
                                    time: []
                                };

                            while( next <= end ){
                                var current_locale = current.toLocaleString();
                                var message = 'O professor '+$scope.professor.firstname+' '+$scope.professor.lastname+' faltou à aula de '+$scope.subject.name;
                                var supervisor_message = 'O professor '+$scope.professor.firstname+' '+$scope.professor.lastname+' faltou à aula de '+$scope.subject.name;
                                var end_time = current;
                                end_time.setHours(parseInt(end_str[0]), parseInt(end_str[1]));
                                absence.time.push({ start: current, end: end_time, late: 20, message: message, supervisor_message: supervisor_message });

                                var current = next;
                                var next = new Date(current.setTime( current.getTime() + 7 * 86400000 ));
                            }

                            AbsenceService.save(absence,function(response){
                                console.log(response);
                                $location.url('/page/subject/schedules/'+$scope.id);
                            });
                        }
                }
                });

            });
        };           
    }

    function scheduleCtrl ($scope, $location, UserService, SubjectService, ScheduleService, $stateParams) {
        $scope.id = $stateParams.id;
        
        ScheduleService.get({id: $scope.id},function(schedule) {
            $scope.schedule = schedule;
            SubjectService.get({id: $scope.schedule.subject},function(subject) {$scope.subject = subject;});
            UserService.get({id: $scope.schedule.professor},function(professor) {$scope.professor = professor;});
        });
        

        var orig_course = angular.copy($scope.course);
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.course, orig_course);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            CourseService.update({id:$scope.id},$scope.course,function(course){
                CourseNameService.save($scope.course.name,function(response){
                    //console.log(response);
                });
            });
        };           
    }

    function batchScheduleCtrl ($scope, $q, $location, UserService, CourseService, SubjectService, ScheduleService, AbsenceService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.ready = [];
        
        $scope.batch = '';

        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        
        $scope.canSubmit = function() {
            var time = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            var phone = /^\d{9}$/;  

            $scope.ready = [];
            var courses = StorageService.courses_by_name();
            var subjects = StorageService.subjects_by_name();
            var users = StorageService.users_by_phone();
            //console.log(JSON.stringify(subjects));

            var lines = $scope.batch.split( "\n" );
            //course,subject,123456789,08:00,10:00,00:00,00:00,08:00,10:00,08:00,10:00,08:00,10:00
            for( var i = 0; i < lines.length; i++ ) {
                var temp = lines[i].split( "," );
                
                if( temp.length != 13 || !phone.test(temp[2]) || !time.test(temp[3]) || !time.test(temp[4]) ||
                    !time.test(temp[5]) || !time.test(temp[6]) || !time.test(temp[7]) || !time.test(temp[8]) ||
                    !time.test(temp[9]) || !time.test(temp[10]) || !time.test(temp[11]) || !time.test(temp[12])){return false;}

                if(courses.hasOwnProperty(temp[0])){var course = courses[temp[0]]}else{return false;}
                console.log('here1');
                //console.log('subject',course+'_'+temp[1]);
                //console.log('subjects',subjects);
                if(subjects.hasOwnProperty(course._id+'_'+temp[1])){ var subject = subjects[course._id+'_'+temp[1]]}else{return false;}
                console.log('here2');
                if(users.hasOwnProperty(temp[2])){var professor = users[temp[2]]}else{return false;}
                console.log(subject);
                
                var temp_schedule = {
                    subject: subject._id,
                    professor: professor._id,
                    school: $scope.id,
                    course: course._id,
                    absences: [],
                    schedule: {
                        monday: {start: temp[3],end: temp[4]},
                        tuesday: {start: temp[5],end: temp[6]},
                        wednesday: {start: temp[7],end: temp[8]},
                        thursday: {start: temp[9],end: temp[10]},
                        friday: {start: temp[11],end: temp[12]}
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
                
                for (var j = 1; j <= 5; j++) {
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
                                    user: professor._id,
                                    phone: professor.phone,
                                    school: professor.school,
                                    year: subject.year,
                                    schedule: '',
                                    //type: 'professor',
                                    course: course._id,
                                    subject: subject._id,
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
                
                $scope.ready.push(temp_schedule);
            }
            return $scope.userForm.$valid;
        };
        
        $scope.submitForm = function() {
            var schedules = $scope.batch.split( "\n" );

            var temp = [];
            //course,subject,email,08:00,10:00,00:00,00:00,08:00,10:00,08:00,10:00,08:00,10:00
            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.ready.length; i++){
                    var absences = $scope.ready[i].absences;
                    //console.log(absences);
                    delete $scope.ready[i].absences;

                    ScheduleService.save($scope.ready[i],function(response){
                        console.log(response);
                        for(var j = 0; j < absences.length; j++){
                            absences[j].schedule = response._id;
                            AbsenceService.save(absences[j],function(response){ console.log(response)},function(error){ console.log(error)});
                        }
                    });
                }
            });
            chain.then(function(){
                $location.url('/page/school/schedules/'+$scope.id);
            });
        };           
    }

    function createScheduleSessionCtrl ($scope, $location, SchoolService, CourseService, SubjectService, SubjectNameService, $stateParams) {
                $scope.id = $stateParams.id;
        
        $scope.subject = {
            name: '',
            course: '',
            school: '',
            year: ''
        };

        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                console.log($scope.course);
                $scope.subject.course = course._id;
                $scope.subject.school = course.school;
            });

        //SubjectNameService.query(function(subjects) {$scope.subjects = subjects;});

        
        var orig_subject = angular.copy($scope.subject);
    
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.subject, orig_subject);
        };    
        
        $scope.submitForm = function() {

            SubjectService.save($scope.subject,function(response){
                console.log(response);
                SubjectNameService.save({name: $scope.subject.name},function(response){
                    //console.log(response);
                });
                $location.url('/page/course/subjects/'+$scope.id);
            });
        };
    }

    function scheduleSessionCtrl ($scope, $location, randomString, SchoolService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                
                SubjectService.query({course: course._id, school: course.school},function(subjects) {
                    $scope.subjects = subjects;
                    console.log(subjects);
                });
            });
        
    }

    function subjectScheduleCtrl ($scope, $location, UserService, SubjectService, ScheduleService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SubjectService.get({id: $scope.id},function(subject) {
                $scope.subject = subject;
                
                ScheduleService.query({subject: $scope.id},function(schedules) {
                    
                    UserService.query({school: $scope.subject.school,type:'professor'},function(professors){
                        for (var i = 0; i < schedules.length; i++) {
                            for (var j = 0; j < professors.length; j++) {
                                if(schedules[i].professor == professors[j]._id){
                                    schedules[i].professor_name = professors[j].firstname+' '+professors[j].lastname;
                                }
                            };
                        };
                        $scope.schedules = schedules;
                    });
                    

                    
                    //console.log($scope.schedules[i]);
                });
            });
        
    }

    function schoolScheduleCtrl ($scope, $location, UserService, SubjectService, ScheduleService, SchoolService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SchoolService.get({id: $scope.id},function(school) {
                $scope.school = school;
                
                ScheduleService.query({school: $scope.id},function(schedules) {
                    
                    UserService.query({school: $scope.id,type:'professor'},function(professors){
                        for (var i = 0; i < schedules.length; i++) {
                            schedules[i].subject_name = StorageService.subject_by_id(schedules[i].subject).name;
                            for (var j = 0; j < professors.length; j++) {
                                if(schedules[i].professor == professors[j]._id){
                                    schedules[i].professor_name = professors[j].firstname+' '+professors[j].lastname;
                                }
                            };
                        };
                        $scope.schedules = schedules;
                    });
                    

                    
                    //console.log($scope.schedules[i]);
                });
            });
        
    }

    function profScheduleCtrl ($scope, $cookies, $location, UserService, SubjectService, ScheduleService, GroupService, $stateParams) {
        console.log($stateParams);
        //console.log(GroupService);
        $scope.id = $stateParams.id;
        //$scope.user = $cookies.getObject('user');
        
        $scope.weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
        
        var temp = new Date();
        
        var offset = -60;

        if(temp.getTimezoneOffset() == offset){
            $scope.d = temp;    
        }else{
            var utc = temp.getTime() + (temp.getTimezoneOffset() * 60000);
            $scope.d = new Date(utc - (3600000*offset));
        }

        

        var year = $scope.d.getFullYear();
        var month = $scope.d.getMonth();
        var day = $scope.d.getDate();
        var hours = $scope.d.getHours();
        var min = $scope.d.getMinutes();
        $scope.weekday = $scope.weekdays[$scope.d.getDay()];
        //console.log($scope.weekday);

        
        $scope.late = 1200;
        $scope.early = 600;
        //$scope.late = 36000;
        //$scope.early = 36000;
    
        UserService.get({id: $scope.id},function(user) {
                $scope.user = user;
                
                ScheduleService.query({professor: $scope.id},function(schedules) {
                   
                    SubjectService.query({school: $scope.user.school},function(subjects){
                        GroupService.query({school: $scope.user.school},function(groups){
                            
                        for (var i = 0; i < schedules.length; i++) {
                            for (var j = 0; j < subjects.length; j++) {
                                if(schedules[i].subject == subjects[j]._id){
                                    schedules[i].subject_name = subjects[j].name;
                                }
                            };

                            for (var j = 0; j < groups.length; j++) {
                                if(schedules[i].group == groups[j]._id){
                                    schedules[i].group_name = groups[j].name;
                                }
                            };

                            schedules[i].schedule.monday.show = false;
                            schedules[i].schedule.monday.hide = true;
                            schedules[i].schedule.tuesday.show = false;
                            schedules[i].schedule.tuesday.hide = true;
                            schedules[i].schedule.wednesday.show = false;
                            schedules[i].schedule.wednesday.hide = true;
                            schedules[i].schedule.thursday.show = false;
                            schedules[i].schedule.thursday.hide = true;
                            schedules[i].schedule.friday.show = false;
                            schedules[i].schedule.friday.hide = true;

                            if($scope.weekday == 'monday'){
                                var start_str = schedules[i].schedule.monday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);
                                //console.log(start_str);
                                //console.log(start);
                                //console.log($scope.d);
                                //console.log(start.getTime());
                                //console.log($scope.d.getTime());
                                console.log('start - now = ',start.getTime() - $scope.d.getTime());
                                console.log('scope early x 1000 = ',$scope.early*1000);
                                console.log('now - start = ',$scope.d.getTime() - start.getTime());
                                console.log('scope late x 1000 = ',$scope.late*1000);
                                console.log('is not early?',start.getTime() - $scope.d.getTime() <= $scope.early*1000)
                                console.log('is not late?',$scope.d.getTime() - start.getTime() <= $scope.late*1000)
                                
                            if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.monday.show = true;
                                    schedules[i].schedule.monday.hide = false;
                                }
                                //console.log($scope.d.getTime() - start.getTime());
                            
                            }
                            if($scope.weekday == 'tuesday'){
                                var start_str = schedules[i].schedule.tuesday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.tuesday.show = true;
                                    schedules[i].schedule.tuesday.hide = false;
                                }
                            }
                        if($scope.weekday == 'wednesday'){
                                var start_str = schedules[i].schedule.wednesday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.wednesday.show = true;
                                    schedules[i].schedule.wednesday.hide = false;
                                }
                            }
                        if($scope.weekday == 'thursday'){
                                var start_str = schedules[i].schedule.thursday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.thursday.show = true;
                                    schedules[i].schedule.thursday.hide = false;
                                }
                            }
                        if($scope.weekday == 'friday'){
                                var start_str = schedules[i].schedule.friday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.friday.show = true;
                                    schedules[i].schedule.friday.hide = false;
                                }
                            }
                        };
                        $scope.schedules = schedules;
                        //console.log($scope.schedules);
                        });
                    });
                    

                    
                    //console.log($scope.schedules[i]);
                });
            });
        
    }

    function profScheduleCtrl_noID ($scope, $cookies, $location, UserService, SubjectService, ScheduleService, GroupService, $stateParams) {
        $scope.id = $cookies.getObject('user').id;
        //$scope.user = $cookies.getObject('user');
        
        $scope.weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
        
        var temp = new Date();
        
        var offset = -60;

        if(temp.getTimezoneOffset() == offset){
            $scope.d = temp;    
        }else{
            var utc = temp.getTime() + (temp.getTimezoneOffset() * 60000);
            $scope.d = new Date(utc - (3600000*offset));
        }

        

        var year = $scope.d.getFullYear();
        var month = $scope.d.getMonth();
        var day = $scope.d.getDate();
        var hours = $scope.d.getHours();
        var min = $scope.d.getMinutes();
        $scope.weekday = $scope.weekdays[$scope.d.getDay()];
        //console.log($scope.weekday);

        
        $scope.late = 1200;
        $scope.early = 600;
        //$scope.late = 36000;
        //$scope.early = 36000;
    
        UserService.get({id: $scope.id},function(user) {
                $scope.user = user;
                
                ScheduleService.query({professor: $scope.id},function(schedules) {
                   
                    SubjectService.query({school: $scope.user.school},function(subjects){
                        GroupService.query({school: $scope.user.school},function(groups){
                            
                        for (var i = 0; i < schedules.length; i++) {
                            for (var j = 0; j < subjects.length; j++) {
                                if(schedules[i].subject == subjects[j]._id){
                                    schedules[i].subject_name = subjects[j].name;
                                }
                            };

                            for (var j = 0; j < groups.length; j++) {
                                if(schedules[i].group == groups[j]._id){
                                    schedules[i].group_name = groups[j].name;
                                }
                            };

                            schedules[i].schedule.monday.show = false;
                            schedules[i].schedule.monday.hide = true;
                            schedules[i].schedule.tuesday.show = false;
                            schedules[i].schedule.tuesday.hide = true;
                            schedules[i].schedule.wednesday.show = false;
                            schedules[i].schedule.wednesday.hide = true;
                            schedules[i].schedule.thursday.show = false;
                            schedules[i].schedule.thursday.hide = true;
                            schedules[i].schedule.friday.show = false;
                            schedules[i].schedule.friday.hide = true;

                            if($scope.weekday == 'monday'){
                                var start_str = schedules[i].schedule.monday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);
                                //console.log(start_str);
                                //console.log(start);
                                //console.log($scope.d);
                                //console.log(start.getTime());
                                //console.log($scope.d.getTime());
                                console.log('start - now = ',start.getTime() - $scope.d.getTime());
                                console.log('scope early x 1000 = ',$scope.early*1000);
                                console.log('now - start = ',$scope.d.getTime() - start.getTime());
                                console.log('scope late x 1000 = ',$scope.late*1000);
                                console.log('is not early?',start.getTime() - $scope.d.getTime() <= $scope.early*1000)
                                console.log('is not late?',$scope.d.getTime() - start.getTime() <= $scope.late*1000)
                                
                            if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.monday.show = true;
                                    schedules[i].schedule.monday.hide = false;
                                }
                                //console.log($scope.d.getTime() - start.getTime());
                            
                            }
                            if($scope.weekday == 'tuesday'){
                                var start_str = schedules[i].schedule.tuesday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.tuesday.show = true;
                                    schedules[i].schedule.tuesday.hide = false;
                                }
                            }
                        if($scope.weekday == 'wednesday'){
                                var start_str = schedules[i].schedule.wednesday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.wednesday.show = true;
                                    schedules[i].schedule.wednesday.hide = false;
                                }
                            }
                        if($scope.weekday == 'thursday'){
                                var start_str = schedules[i].schedule.thursday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.thursday.show = true;
                                    schedules[i].schedule.thursday.hide = false;
                                }
                            }
                        if($scope.weekday == 'friday'){
                                var start_str = schedules[i].schedule.friday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if(start.getTime() - $scope.d.getTime() <= $scope.early*1000 && $scope.d.getTime() - start.getTime() <= $scope.late*1000){
                                    schedules[i].schedule.friday.show = true;
                                    schedules[i].schedule.friday.hide = false;
                                }
                            }
                        };
                        $scope.schedules = schedules;
                        //console.log($scope.schedules);
                        });
                    });
                    

                    
                    //console.log($scope.schedules[i]);
                });
            });
        
    }

})(); 