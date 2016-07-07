(function () {
    'use strict';

    angular.module('app.course', ['app.service','validation.match','angularRandomString'])
        .controller('createCourseCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','CourseService','CourseNameService','SubjectService','SubjectNameService','$stateParams',createCourseCtrl])
        .controller('courseSubjectCtrl', ['$scope','$location','randomString', 'SchoolService','CourseService', 'SubjectService','$stateParams',courseSubjectCtrl])
        .controller('createCourseSubjectCtrl', ['$scope','$location','SchoolService','CourseService','SubjectService','SubjectNameService','$stateParams',createCourseSubjectCtrl])
        .controller('courseCtrl', ['$scope','$location','randomString', 'UserService','SchoolService','CourseService','CourseNameService','$stateParams',courseCtrl])
        .controller('batchCourseCtrl', ['$scope','$q','$location','SchoolService','CourseService','CourseNameService','SubjectService','SubjectNameService','StorageService','$stateParams',batchCourseCtrl]);


    function createCourseCtrl ($scope, $location, randomString, UserService, SchoolService, CourseService, CourseNameService, SubjectService, SubjectNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        //$scope.user = $cookies.getObject('user');
        //console.log($stateParams.id);

        $scope.course = {
            name: '',
            school: $scope.id,
            description: '',
            supervisor: {
                firstname: '',
                lastname: '',
                email: '',
                phone: ''
            }
        };

        SchoolService.get({id: $scope.id},function(school) {
            $scope.school = school;
            $scope.course.school = $scope.school._id;
        });

        //CourseNameService.query(function(courses) {$scope.courses = courses;});
        //SubjectNameService.query(function(subjects) {$scope.subjects = subjects;});

        $scope.course_subjects = [{year: 1, subjects: ''},{year: 2, subjects: ''},{year: 3, subjects: ''},{year: 4, subjects: ''},{year: 5, subjects: ''}];

        $scope.labels = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto'];

        

        var orig_course = angular.copy($scope.course);
    
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.course, orig_course) && !!$scope.course.school;
        };    
        
        $scope.submitForm = function() {

            //$scope.course.school_course = $scope.school.name + '_' + $scope.course.name;
            
            CourseNameService.save({name: $scope.course.name},function(response){console.log(response);});

            CourseService.save($scope.course,function(response){ 
                console.log(response);

                for (var i = 0; i < $scope.course_subjects.length; i++) {
                if($scope.course_subjects[i].subjects != ''){
                    var list = $scope.course_subjects[i].subjects.split(',');

                    for (var j = 0; j < list.length; j++) {
                        var temp = list[j];
                        SubjectNameService.save({name: list[j]},function(response){
                            console.log(response);
                            temp = '';
                        });
                        
                        var subject = {name: list[j], school: $scope.school._id, course: response._id, year: i };
                        
                        SubjectService.save(subject,function(response){console.log(response);subject = '';});
                    }
                }
            };


                $location.url('/page/school/courses/'+$scope.school._id);
                
            });


            
        };           
        
        
    }

    function courseCtrl ($scope, $location, randomString, UserService, SchoolService, CourseService, CourseNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
            $scope.course = course;
            SchoolService.get({id: $scope.course.school},function(school) {$scope.school = school;});
        });
        

        var orig_course = angular.copy($scope.course);
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.course, orig_course);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            CourseService.update({id:$scope.id},$scope.course,function(course){
                CourseNameService.save({name: $scope.course.name},function(response){console.log(response);});
            });
        };           
    }

    function batchCourseCtrl ($scope, $q, $location, SchoolService, CourseService, CourseNameService, SubjectService, SubjectNameService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.ready = [];

        $scope.batch = '';

        SchoolService.get({id: $scope.id},function(school) {$scope.school = school;});
        StorageService.load();
        
        $scope.canSubmit = function() {
            
            var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var phone = /^\d{9}$/;  

            $scope.ready = [];
            var valid = true;
            var school = /^[0-9a-fA-F]{24}$/;
            var courses = StorageService.courses();
            var users = StorageService.users();
            //var found = false;
            var found = true;


            var lines = $scope.batch.split( "\n" );
            //curso1,supervisor1,supervisor2,email@sup.com,111111111
            for( var i = 0; i < lines.length; i++ ) {
                var temp = lines[i].split( "," );
                if(temp.length != 5 || !email.test(temp[3]) || !phone.test(temp[4])){ return false;}
                for( var j = 0; j < courses.length; j++ ) { if(temp[0] == courses[j].name){ return false;} }
                for( var j = 0; j < users.length; j++ ) { if(temp[3] == users[j].email || temp[4] == users[j].phone){ found = true; break;} }
                if(found){
                    $scope.ready.push({
                                    name: temp[0],
                                    school: $scope.id,
                                    description: 'Sem descrição',
                                    supervisor: {
                                        firstname: temp[1],
                                        lastname: temp[2],
                                        email: temp[3],
                                        phone: temp[4]
                                }
                            });}
            }
            return $scope.userForm.$valid && valid && found;
        };
        
        $scope.submitForm = function() {
            
            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.ready.length; i++){ CourseService.save($scope.ready[i],function(response){ console.log(response);}); }
            });
            chain.then(function(){
                $location.url('/page/school/courses/'+$scope.id);
            });

        };           
    }

    function createCourseSubjectCtrl ($scope, $location, SchoolService, CourseService, SubjectService, SubjectNameService, $stateParams) {
                $scope.id = $stateParams.id;
        
        $scope.subject = {
            name: '',
            description: '',
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
                SubjectNameService.save({name: $scope.subject.name},function(response){console.log(response);});
                $location.url('/page/course/subjects/'+$scope.id);
            });
        };
    }

    function courseSubjectCtrl ($scope, $location, randomString, SchoolService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                
                SubjectService.query({course: course._id, school: course.school},function(subjects) {
                    $scope.subjects = subjects;
                    console.log(subjects);
                });
            });
        
    }

})(); 