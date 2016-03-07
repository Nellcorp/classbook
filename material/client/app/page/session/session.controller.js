(function () {
    'use strict';

    angular.module('app.session', ['ngResource','validation.match','angularRandomString'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("ScheduleService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schedules/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SessionService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/sessions/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .controller('createSessionCtrl', ['$scope','$location', 'UserService', 'SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',createSessionCtrl])
        .controller('sessionCtrl', ['$scope','$location', 'UserService', 'SchoolService','CourseService','SubjectService','ScheduleService','SessionService','$stateParams',sessionCtrl]);


    function createSessionCtrl ($scope, $location, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
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

        UserService.get({id: $stateParams.user},function(user){
            $scope.user = user;
            ScheduleService.get({id: $scope.id},function(schedule){
                $scope.schedule = schedule;
                SubjectService.get({id: schedule.subject},function(subject){
                    $scope.subject = subject;
                    CourseService.get({id: subject.course},function(course){
                        $scope.course = course;
                        UserService.query({course: course._id,type: 'student'},function(students){
                            $scope.students = students;

                            var start_str = $scope.schedule.schedule[$scope.weekday_str].start.split( ":" );
        var start = new Date(year,month,day,start_str[0],start_str[1]);
        var end_str = $scope.schedule.schedule[$scope.weekday_str].end.split( ":" );
        var end = new Date(year,month,day,start_str[0],end_str[1]);

        $scope.late = 999999999;
        $scope.early = -600;
            
        if($scope.d.getTime() - start.getTime() < $scope.early || $scope.d.getTime() - start.getTime() >= $scope.late){
                   $location.url('/page/profile/'+$scope.user._id);
        }
        
        
        
        $scope.session = {
            title: '',
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
        });

        
        $scope.selected = [];
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item._id);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item._id);
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item._id) > -1;
        };        


        
        
        $scope.canSubmit = function() {
            //return $scope.session.summary != '';
            return true;
        };    
        
        $scope.submitForm = function() {
            var missing = $scope.students;
            for (var i = 0; i < $scope.selected.length; i++) {
                for (var j = 0; j < missing.length; j++) {
                    if($scope.selected[i] == missing[j]._id){missing.splice(j, 1);}
                };
            };

            console.log(missing);
            
            $scope.session.missing = missing;

            SessionService.save($scope.session,function(response){ 
                console.log(response);
                $location.url('/page/session/profile/'+$scope.response._id);
        });


            
        };           
        
        
    }

    function sessionCtrl ($scope, $location, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.students = [];

        SessionService.get({id: $scope.id},function(session) {
            $scope.session = session;
            $scope.date = new Date(session.started).toLocaleString();
            
            SubjectService.get({id: session.subject},function(subject) {$scope.subject = subject;});     

            for (var i = 0; i < session.missing.length; i++) {
                UserService.get({id: session.missing[i]},function(missing) {$scope.students.push(missing);});     
            };
            
        });
        
        
    }



})(); 