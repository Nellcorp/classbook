(function () {
    'use strict';

    angular.module('app.session', ['app.service','validation.match','angularRandomString'])
        .controller('createSessionCtrl', ['$scope', '$q', '$cookies','$location', 'UserService', 'SchoolService','CourseService','SubjectService','ScheduleService','SessionService','AbsenceService','$stateParams',createSessionCtrl])
        .controller('sessionCtrl', ['$scope','$location', 'UserService', 'SchoolService','CourseService','SubjectService','ScheduleService','SessionService','AbsenceService','$stateParams',sessionCtrl]);


    function createSessionCtrl ($scope, $q, $cookies, $location, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AbsenceService, $stateParams) {
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

        $scope.locale = $scope.d.toLocaleString();
        
        var year = $scope.d.getFullYear();
        var month = $scope.d.getMonth();
        var day = $scope.d.getDate();
        var hours = $scope.d.getHours();
        var min = $scope.d.getMinutes();
        var weekday = $scope.d.getDay();
        $scope.weekday_str = $scope.weekdays[$scope.d.getDay()];

        $scope.user = $cookies.getObject('user');
        //UserService.get({id: $stateParams.user},function(user){
            //$scope.user = user;

            ScheduleService.get({id: $scope.id},function(schedule){
                $scope.schedule = schedule;
                SubjectService.get({id: schedule.subject},function(subject){
                    $scope.subject = subject;
                    CourseService.get({id: subject.course},function(course){
                        $scope.course = course;
                        UserService.query({course: course._id,type: 'student', year: subject.year},function(students){
                            $scope.students = students;

        var start_str = $scope.schedule.schedule[$scope.weekday_str].start.split( ":" );
        var start = new Date(year,month,day,start_str[0],start_str[1]);
        var end_str = $scope.schedule.schedule[$scope.weekday_str].end.split( ":" );
        var end = new Date(year,month,day,start_str[0],end_str[1]);

        SessionService.query({start: start,end: end,schedule: $scope.schedule._id},function(sessions){
                    if(sessions.length > 0){$location.url('/page/profile/'+$scope.user.id);}
        });

        $scope.late = 999999999;
        //$scope.early = -600;
        $scope.early = -4000000;
            
        if($scope.d.getTime() - start.getTime() < $scope.early*1000 || $scope.d.getTime() - start.getTime() >= $scope.late*1000){
                   $location.url('/page/profile/'+$scope.user.id);
        }
        
        
        
        $scope.session = {
            title: $scope.subject.name,
            schedule: $scope.schedule._id,
            summary: '',
            start: start,
            end: end,
            started: $scope.d,
            missing: []
        };

        var orig;

        orig = angular.copy($scope.session);
                        });
                    });
                });
            });
        //});

        
        $scope.selected = [];
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item._id);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item._id);
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item._id) > -1;
        };        


        $scope.init = function() {
            
        };    
        
        $scope.canSubmit = function() {
            //return $scope.session.summary != '';
            return !!$scope.students;
        };    
        
        $scope.submitForm = function() {
            var missing = $scope.students;
            console.log(missing);
            for (var i = 0; i < $scope.selected.length; i++) {
                for (var j = 0; j < missing.length; j++) {
                    if($scope.selected[i] == missing[j]._id){missing.splice(j, 1);}
                    console.log(missing);
                };
            };

            delete $scope.students;
            //console.log(missing);
            
            $scope.session.missing = missing;

            SessionService.save($scope.session,function(response){
                console.log(response);
                var session_id = response._id;
                var chain = $q.when();
            angular.forEach(missing, function(student,key){
                chain = chain.then(function(){
                    var absence = {
                        user: student._id,
                        phone: student.phone,
                        school: student.school,
                        year: student.year,
                        course: $scope.course.name,
                        subject: $scope.subject.name,
                        type: 'student',
                        session: response._id,
                        message: student.firstname+', faltou à aula de '+$scope.subject.name+' em '+$scope.d.toLocaleDateString(),
                        supervisor_phone: student.supervisor.phone,
                        supervisor_message: student.firstname+', faltou à aula de '+$scope.subject.name+' em '+$scope.d.toLocaleDateString(),
                        time: $scope.locale
                    };
                    
                    return AbsenceService.save(absence,function(res){
                        //console.log(res);
                    });
                });
            });

            // the final chain object will resolve once all the posts have completed.
            chain.then(function(){
                console.log('all done!');
                $location.url('/page/session/profile/'+session_id);
            });
        });


            
        };           
        
        
    }

    function sessionCtrl ($scope, $location, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AbsenceService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.students = [];

        SessionService.get({id: $scope.id},function(session) {
            $scope.session = session;
            $scope.date = new Date(session.started).toLocaleString();
            console.log(session);
            ScheduleService.get({id: session.schedule},function(schedule) {
                $scope.schedule = schedule;
                SubjectService.get({id: schedule.subject},function(subject) {
                    $scope.subject = subject;

                    angular.forEach(session.missing, function(student,key){
                        UserService.get({id: student},function(response) {$scope.students.push(response);});
                    });
                });
            });
            });   
    }



})(); 