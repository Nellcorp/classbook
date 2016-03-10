(function () {
    'use strict';

    angular.module('app.schedule', ['ngResource','validation.match','angularRandomString'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("ScheduleService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schedules/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SessionService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/sessions/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .controller('createScheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService','$stateParams',createScheduleCtrl])
        .controller('subjectScheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService', '$stateParams',subjectScheduleCtrl])
        .controller('profScheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService', '$stateParams',profScheduleCtrl])
        .controller('scheduleSessionCtrl', ['$scope','$location','randomString', 'SchoolService','CourseService', 'SubjectService','$stateParams',scheduleSessionCtrl])
        .controller('createScheduleSessionCtrl', ['$scope','$location','SubjectService','SessionService','$stateParams',createScheduleSessionCtrl])
        .controller('scheduleCtrl', ['$scope','$location','UserService','SubjectService','ScheduleService','$stateParams',scheduleCtrl])
        .controller('batchScheduleCtrl', ['$scope','$location','UserService','CourseService','SubjectService','ScheduleService','$stateParams',batchScheduleCtrl]);


    function createScheduleCtrl ($scope, $location, UserService, SubjectService, ScheduleService, $stateParams) {
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

        SubjectService.get({id: $scope.id},function(response) {
            $scope.subject = response;
            $scope.schedule.subject = $scope.subject._id;
        });

        

        var orig = angular.copy($scope.schedule);
    
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.subject, orig);
        };    
        
        $scope.submitForm = function() {

            UserService.query({email: $scope.email, type: 'professor'},function(response) {
                
                $scope.professor = response[0];
                $scope.schedule.professor = response[0]._id;

                //console.log($scope.schedule);
                ScheduleService.save($scope.schedule,function(response){
                    //console.log(response);
                    $location.url('/page/subject/schedules/'+$scope.id);
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

    function batchScheduleCtrl ($scope, $location, UserService, CourseService, SubjectService, ScheduleService, $stateParams) {
        //console.log($stateParams);
        $scope.id = $stateParams.id;
        
        $scope.batch = '';

        CourseService.get({id: $scope.id},function(course) {
            $scope.course = course;

            SubjectService.query({course: $scope.id},function(subjects) {
                $scope.subjects = subjects;
                //console.log($scope.subjects);
            });
            UserService.query({school: $scope.course.school, type: 'professor'},function(professors) {$scope.professors = professors;});
        });
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid;
        };    
        
        $scope.submitForm = function() {
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;
            var time = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

            var schedules = $scope.batch.split( "\n" );

            var temp = [];
            //subject,email,08:00,10:00,00:00,00:00,08:00,10:00,08:00,10:00,08:00,10:00
            for( var i = 0; i < schedules.length; i++ ) {

                temp = schedules[i].split( "," );
                //console.log(temp);

                if( temp.length == 12 && email.test(temp[1]) != false &&
                    time.test(temp[2]) != false && time.test(temp[3]) != false &&
                    time.test(temp[4]) != false && time.test(temp[5]) != false &&
                    time.test(temp[6]) != false && time.test(temp[7]) != false &&
                    time.test(temp[8]) != false && time.test(temp[9]) != false &&
                    time.test(temp[10]) != false && time.test(temp[11]) != false){
                    
                    var schedule = {
                                    subject: '',
                                    professor: '',
                                    schedule: {
                                        monday: {start: temp[2],end: temp[3]},
                                        tuesday: {start: temp[4],end: temp[5]},
                                        wednesday: {start: temp[6],end: temp[7]},
                                        thursday: {start: temp[8],end: temp[9]},
                                        friday: {start: temp[10],end: temp[11]}
                                }
                            };

                    for( var j = 0; j < $scope.subjects.length; j++ ) {
                        if($scope.subjects[j].name == temp[0]){
                            schedule.subject = $scope.subjects[j]._id;
                        }
                    }
                    for( var j = 0; j < $scope.professors.length; j++ ) {if($scope.professors[j].email == temp[1]){ schedule.professor = $scope.professors[j]._id;}}
                
                    ScheduleService.save(schedule,function(response){
                        //console.log(response);
                    });
                }
            }

        $location.url('/page/course/subjects/'+$scope.course.school);
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

    function profScheduleCtrl ($scope, $location, UserService, SubjectService, ScheduleService, $stateParams) {
        $scope.id = $stateParams.id;
        
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
        $scope.early = -600;
    
        UserService.get({id: $scope.id},function(user) {
                $scope.user = user;
                
                ScheduleService.query({professor: $scope.id},function(schedules) {
                   
                    SubjectService.query({school: $scope.user.school},function(subjects){
                        for (var i = 0; i < schedules.length; i++) {
                            for (var j = 0; j < subjects.length; j++) {
                                if(schedules[i].subject == subjects[j]._id){
                                    schedules[i].subject_name = subjects[j].name;
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
                                
                                if($scope.d.getTime() - start.getTime() >= $scope.early || $scope.d.getTime() - start.getTime() < $scope.late){
                                    schedules[i].schedule.monday.show = true;
                                    schedules[i].schedule.monday.hide = false;
                                }
                                //console.log($scope.d.getTime() - start.getTime());
                            
                            }
                            if($scope.weekday == 'tuesday'){
                                var start_str = schedules[i].schedule.tuesday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if($scope.d.getTime() - start.getTime() >= $scope.early || $scope.d.getTime() - start.getTime() < $scope.late){
                                    schedules[i].schedule.tuesday.show = true;
                                    schedules[i].schedule.tuesday.hide = false;
                                }
                            }
                        if($scope.weekday == 'wednesday'){
                                var start_str = schedules[i].schedule.wednesday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if($scope.d.getTime() - start.getTime() >= $scope.early || $scope.d.getTime() - start.getTime() < $scope.late){
                                    schedules[i].schedule.wednesday.show = true;
                                    schedules[i].schedule.wednesday.hide = false;
                                }
                            }
                        if($scope.weekday == 'thursday'){
                                var start_str = schedules[i].schedule.thursday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if($scope.d.getTime() - start.getTime() >= $scope.early || $scope.d.getTime() - start.getTime() < $scope.late){
                                    schedules[i].schedule.thursday.show = true;
                                    schedules[i].schedule.thursday.hide = false;
                                }
                            }
                        if($scope.weekday == 'friday'){
                                var start_str = schedules[i].schedule.friday.start.split( ":" );
                                var start = new Date(year,month,day,start_str[0],start_str[1]);

                                if($scope.d.getTime() - start.getTime() >= $scope.early || $scope.d.getTime() - start.getTime() < $scope.late){
                                    schedules[i].schedule.friday.show = true;
                                    schedules[i].schedule.friday.hide = false;
                                }
                            }
                        };
                        $scope.schedules = schedules;
                        //console.log($scope.schedules);
                    });
                    

                    
                    //console.log($scope.schedules[i]);
                });
            });
        
    }

})(); 